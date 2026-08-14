import { installRootCA } from './actions/loginToOs'
import { configYaml } from './fileModels/configYaml'
import { i18n } from './i18n'
import { uiHostId, uiInterfaceId } from './interfaces'
import { sdk } from './sdk'
import {
  BUNDLE_URL,
  bundlePath,
  dashboardPort,
  dataDir,
  mainMounts,
} from './utils'

// Probe Hermes' own provider resolver — exit 0 iff a usable LLM provider is
// configured (it raises otherwise). Run with the venv python so hermes_cli is
// importable; it reads config.yaml via HERMES_HOME plus the .env we load here.
const PROVIDER_PROBE = `from dotenv import load_dotenv
from hermes_cli.runtime_provider import resolve_runtime_provider
load_dotenv("${dataDir}/.env")
resolve_runtime_provider()
`

// Probe the gateway daemon's own liveness via upstream's pid-file logic
// (gateway.status.get_running_pid) — the same signal the dashboard uses. Exit 0
// iff the gateway process is running, independent of which messaging platforms
// (if any) the user has configured. The OpenAI-compatible API server is one
// such opt-in platform, enabled from the dashboard — not something this package
// forces on, so the gateway has no guaranteed listening port to probe.
const GATEWAY_PROBE = `import os, sys
os.environ.setdefault("HERMES_HOME", "${dataDir}")
from gateway.status import get_running_pid
sys.exit(0 if get_running_pid() else 1)
`

// StartOS supervises each daemon directly, but the Hermes daemons themselves
// launch session/tool subprocess trees. Make the daemon boundary a Linux child
// subreaper so descendants orphaned by a completed or interrupted session are
// adopted and waited for here instead of accumulating as zombies under the
// container's launch-init. `-g` forwards signals to the whole child process
// group, preserving clean StartOS stop/restart behavior.
const withSubreaper = (
  command: [string, ...string[]],
): [string, ...string[]] => ['tini', '-s', '-g', '--', ...command]

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Hermes Agent!'))

  // Re-run main when the managed skills wiring changes. The dashboard password
  // needs no watch here: Set Dashboard Password is `only-stopped`, so the new
  // hash is always in place before the dashboard process next reads it.
  await configYaml.read((c) => c.skills?.external_dirs).const(effects)

  // The dashboard's own LXC-bridge (lxcbr0) URL for the `ui` interface, e.g.
  // `http://10.0.3.1:9119/login`. Replaces the retired `hermes-agent.startos:<port>`
  // DNS name for the in-box health check. The map fn returns just the resolved
  // URL, so `.const()` re-runs `main` only if that URL changes.
  const uiUrl = await sdk.host
    .getOwn(effects, uiHostId, (host) => {
      const iface = Object.values(host?.bindings ?? {})
        .flatMap((b) => Object.values(b.interfaces))
        .find((i) => i.id === uiInterfaceId)
      return iface
        ? iface.addressInfo
            .filter({ kind: 'bridge', predicate: (h) => !h.ssl })
            .format('urlstring')[0]
        : undefined
    })
    .const()

  // `addressInfo.suffix` is the interface's own path, so `uiUrl` ends in `/login`.
  // Resolve the probe against the origin rather than appending to it: upstream
  // matches `/login` as a public *prefix*, so `${uiUrl}/api/status` serves the
  // login page HTML with a 200. `checkWebUrl` succeeds on any HTTP response, so
  // that probe would report the dashboard healthy while never reaching its status
  // endpoint at all.
  const statusUrl = uiUrl && new URL('/api/status', uiUrl).href

  const sub = sdk.SubContainer.of(
    effects,
    { imageId: 'hermes-agent' },
    mainMounts(),
    'hermes-sub',
  )

  const env = {
    HOME: dataDir,
    NODE_EXTRA_CA_CERTS: '/etc/ssl/certs/ca-certificates.crt',
  }

  // `runHealthScript` execs as the image's default user — here root, because the
  // Dockerfile's last `USER` is root and is never reset. A root-run probe that
  // does `import hermes_cli` (both probes below do, via runtime_provider and
  // gateway.status) creates auth-store files on the data volume — `auth.lock`,
  // `auth.json` — owned by root. That EACCES-breaks the uid-1000 gateway's
  // short-lived Nous/OAuth token refresh, dropping inference until the next boot
  // chown re-owns the files (issue #6). Run the probes as `hermes` (uid 1000),
  // the same user the daemons run as, so whatever they touch on the volume stays
  // uid-1000-owned. Mirrors runHealthScript otherwise (30s exec timeout → SIGKILL
  // → failure).
  const runProbeAsHermes = async (
    script: string,
    message: string,
    errorMessage: string,
  ) => {
    try {
      await sub.execFail(['/opt/hermes/.venv/bin/python3', '-c', script], {
        user: 'hermes',
      })
      return { result: 'success' as const, message }
    } catch (e) {
      console.warn(errorMessage)
      console.warn(String(e))
      return { result: 'failure' as const, message: errorMessage }
    }
  }

  const etagPath = `${dataDir}/.startos/knowledge/bundle.etag`
  const tmpPath = `${bundlePath}.tmp`

  return (
    sdk.Daemons.of(effects)
      .addOneshot('install-root-ca', {
        subcontainer: sub,
        exec: {
          fn: async (subcontainer) => {
            await installRootCA(effects, subcontainer)
            return null
          },
        },
        requires: [],
      })
      .addOneshot('chown', {
        subcontainer: sub,
        // Root-context writers — init's mkdir/merge/cp and the actions' file
        // models — create the volume root, its top-level files and `.startos`
        // owned by root, and the uid-1000 daemons then EACCES on their own
        // auth-store refresh (issue #6). That is the whole set: everything
        // deeper is written by hermes, so a `-R` over the volume walks the
        // agent's repos and caches to repair nothing while both daemons wait
        // on it, and aborts into a retry if a file vanishes mid-traversal.
        exec: {
          command: [
            'sh',
            '-c',
            `chown 1000:1000 '${dataDir}'; ` +
              `for f in '${dataDir}'/* '${dataDir}'/.[!.]*; do ` +
              `[ -f "$f" ] && chown 1000:1000 "$f"; done; ` +
              `chown -R 1000:1000 '${dataDir}/.startos'`,
          ],
        },
        requires: [],
      })
      .addDaemon('dashboard', {
        subcontainer: sub,
        exec: {
          command: withSubreaper([
            'hermes',
            'dashboard',
            '--host',
            '0.0.0.0',
            '--port',
            dashboardPort.toString(),
            '--no-open',
          ]),
          env,
          user: 'hermes',
        },
        ready: {
          display: i18n('Web Dashboard'),
          gracePeriod: 60_000,
          fn: () =>
            // `/api/status` is upstream's exact-match public probe path; every
            // other endpoint 401s behind the auth gate.
            statusUrl
              ? sdk.healthCheck.checkWebUrl(effects, statusUrl, {
                  successMessage: i18n('The dashboard is ready'),
                  errorMessage: i18n('The dashboard is not ready'),
                })
              : Promise.resolve({
                  result: 'starting' as const,
                  message: i18n('The dashboard is not ready'),
                }),
        },
        requires: ['install-root-ca', 'chown'],
      })
      .addDaemon('gateway', {
        subcontainer: sub,
        exec: {
          command: withSubreaper(['hermes', 'gateway', 'run']),
          env,
          user: 'hermes',
        },
        ready: {
          display: i18n('Messaging Gateway'),
          gracePeriod: 60_000,
          fn: () =>
            runProbeAsHermes(
              GATEWAY_PROBE,
              i18n('The messaging gateway is running'),
              i18n('The messaging gateway is not running'),
            ),
        },
        requires: ['install-root-ca', 'chown'],
      })
      // Surfaces onboarding state: green once an LLM provider resolves, otherwise
      // points the user at the Configure Provider action.
      .addHealthCheck('provider-configured', {
        ready: {
          display: i18n('LLM Provider'),
          gracePeriod: 30_000,
          fn: () =>
            runProbeAsHermes(
              PROVIDER_PROBE,
              i18n('An LLM provider is configured'),
              i18n(
                'No LLM provider configured — run the Configure Provider action',
              ),
            ),
        },
        requires: [],
      })
      // Background refresh of the support knowledge bundle (ETag'd HTTP GET).
      .addDaemon('bundle-refresh', {
        subcontainer: sub,
        exec: {
          command: [
            'sh',
            '-c',
            `while true; do ` +
              `curl -fsS --etag-compare "${etagPath}" --etag-save "${etagPath}" -o "${tmpPath}" "${BUNDLE_URL}" ` +
              `&& [ -s "${tmpPath}" ] && mv "${tmpPath}" "${bundlePath}"; ` +
              `sleep 86400; done`,
          ],
          env,
          user: 'hermes',
        },
        ready: {
          display: i18n('Knowledge Bundle'),
          gracePeriod: 30_000,
          fn: () =>
            sdk.healthCheck.runHealthScript(['test', '-f', bundlePath], sub, {
              errorMessage: i18n('The support knowledge bundle is not present'),
              message: () => i18n('The support knowledge bundle is present'),
            }),
        },
        requires: [],
      })
  )
})
