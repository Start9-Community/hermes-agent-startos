<p align="center">
  <img src="icon.png" alt="Hermes Agent Logo" width="21%">
</p>

# Hermes Agent on StartOS

> **Upstream repo:** <https://github.com/NousResearch/hermes-agent>
> · **Upstream docs:** <https://hermes-agent.nousresearch.com/docs>
>
> This package runs the **official upstream `nousresearch/hermes-agent` image** — it does **not** fork Hermes. Anything not described here behaves as upstream Hermes does; the upstream documentation is accurate and fully applicable.

[Hermes Agent](https://hermes-agent.nousresearch.com) is an open-source (MIT) autonomous AI agent from [Nous Research](https://nousresearch.com). It chats, runs tools, browses the web, edits files, and connects to messaging platforms (Telegram, Discord, Signal, Slack, Matrix, and more). It improves the longer it runs — building reusable skills, storing preferences, and carrying memory across sessions.

StartOS supplies what Hermes would otherwise need a wrapper for — network addressing, configuration forms, health visibility, and lifecycle management — so this package runs the upstream `hermes dashboard` and `hermes gateway` binaries directly, with only a thin StartOS layer added on top (root CA, `start-cli`, managed skills, and a baseline knowledge bundle). Dashboard authentication is Hermes' own; StartOS seeds the credential (see [Network Access and Interfaces](#network-access-and-interfaces)).

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Base image    | `nousresearch/hermes-agent` (official upstream, pinned by digest)                                                 |
| StartOS layer | StartOS root CA + `start-cli`, `git`/`jq`/`ripgrep`, managed skills, baseline knowledge bundle (see `Dockerfile`) |
| Architectures | x86_64, aarch64                                                                                                   |

All containers share one subcontainer of the `main` volume. The runtime is composed in `startos/main.ts`:

| Component         | Kind    | Command                                                       | Purpose                                                                                     |
| ----------------- | ------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `install-root-ca` | oneshot | (installs the StartOS root CA into the image trust store)     | Lets `start-cli` and the agent reach the local box over HTTPS                               |
| `chown`           | oneshot | `chown -R 1000:1000 /opt/data`                                | Hand the data dir to the `hermes` user (uid/gid 1000)                                       |
| `dashboard`       | daemon  | `hermes dashboard --host 0.0.0.0 --port 9119 --no-open`       | Web UI: chat, config, sessions/memory, skills, logs, analytics, cron                        |
| `gateway`         | daemon  | `hermes gateway run`                                          | Messaging-platform integrations (Telegram, Discord, Signal, …), configured in the dashboard |
| `bundle-refresh`  | daemon  | ETag'd `curl` loop (24h) against the support knowledge bundle | Keeps the `startos-support` knowledge current                                               |

`dashboard` and `gateway` require both oneshots before they start.

---

## Volume and Data Layout

| Volume | Mount Point | Purpose                                                                  |
| ------ | ----------- | ------------------------------------------------------------------------ |
| `main` | `/opt/data` | Hermes data dir (`HERMES_HOME`) — config, sessions, memory, skills state |

**Key paths:**

- `/opt/data/config.yaml`, `/opt/data/.env` — Hermes' own config + credentials (see Configuration).
- `/opt/data/.startos/config.yaml`, `/opt/data/.startos/id.key.pem` — `start-cli`'s host (seeded from the OS IP at init) and the signing key **Login to StartOS** enrolls with the server. The key is a root-equivalent credential; **Revoke StartOS Access** un-enrolls and deletes it. Owned by uid 1000 so the agent can use it.
- `/opt/data/.startos/knowledge/bundle.json` — the refreshable support knowledge bundle (live copy).
- `/opt/startos/skills`, `/opt/startos/knowledge/bundle.json` — **image-owned** managed context (the `start-cli` and `startos-support` skills, plus the baseline bundle). Outside the data volume so it updates with package upgrades and the agent cannot edit it.

---

## Installation and First-Run Flow

1. Hermes runs an LLM that can execute commands on your behalf — a **root-equivalent capability** once **Login to StartOS** is granted (see Limitations). The `instructions.md` intro and the _Login to StartOS_ task/action warnings surface this.
2. **Set Dashboard Password** is a critical task whenever no password hash is set — the service stays stopped until it is run. It returns the password once (username `admin`); save it. Upgrades from a release that served the dashboard unauthenticated get the same task.
3. On first start, the **Configure Provider** action is a critical task: Hermes cannot run until an LLM backend resolves.
4. Pick a backend in **Configure Provider** (a cloud OpenAI-compatible / Gemini / Grok / Anthropic provider, **OpenAI Codex OAuth**, or local **Ollama** / **vLLM** / **llama.cpp**). Selecting a local backend adds it as a running dependency and resolves the backend URL (and key, where published) over the LXC bridge at apply time — the backend must already be installed and running, otherwise the action errors. Selecting OpenAI Codex OAuth starts a browser device-code login and returns the URL/code. For the named cloud providers the model field is a **default-model dropdown** (with a Custom field for ids not yet listed); the chosen model is the default and is changeable later from within Hermes via `/model`.
5. For OpenAI Codex OAuth, open the returned URL, enter the code, then run **Complete OpenAI Codex OAuth** to exchange the browser approval for Hermes tokens.
6. The **LLM Provider** health check turns green once a provider resolves; open the **Web Dashboard** to chat.
7. _(Optional)_ Run **Login to StartOS** to authenticate the bundled `start-cli` so the agent can administer this server. The master password is used for that action run; `start-cli` stores its enrolled identity key on the data volume.
8. Run **Revoke StartOS Access** any time you want to remove Hermes' stored `start-cli` authentication without uninstalling the service.

---

## Configuration Management

Hermes is configured through its own files on the data volume, modeled as StartOS file models (`startos/fileModels/`) for two-way binding with the dashboard's own editor:

- `config.yaml` — the `model` routing block (`provider`, `base_url`, `api_key`, `default`), `skills.external_dirs`, messaging channels.
- `.env` — provider credentials read by name (e.g. `GEMINI_API_KEY`).
- `auth.json` — Hermes OAuth provider state, including OpenAI Codex OAuth tokens.

These files are **authoritative and two-way bound**: both the StartOS actions and the dashboard write them, so changes **merge** rather than clobber — config is not re-pushed via env-var overrides on every restart. The **Configure Provider** action writes the `model` routing block (and records the selection so `setupDependencies` can flip the local-backend dependency); everything else is managed in the dashboard.

**Where credentials land:** Hermes host-gates `.env` API keys (an OpenAI key is only sent to OpenAI), so where a backend needs a key the action writes it into `config.yaml`'s `model.api_key` (the path Hermes honours for config-supplied base URLs) rather than `.env` — that covers `custom` cloud endpoints (OpenAI-compatible, Grok) and vLLM, whose key is read automatically from its `public` credentials volume. Ollama and llama.cpp run keyless (llama.cpp's basic auth is enforced only at the OS reverse-proxy edge, so internal bridge connections need none). Gemini and Anthropic are named providers and take their keys from `.env` (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`). OpenAI Codex OAuth is a named provider (`openai-codex`) and takes access/refresh tokens from `auth.json` under `providers.openai-codex.tokens`; **Configure Provider** starts OpenAI's browser device-code login, and **Complete OpenAI Codex OAuth** stores the returned tokens. The action always sets `model.provider` explicitly (never `auto`), so stale keys can't mis-route.

`skills.external_dirs` in `config.yaml` points at the image-owned `/opt/startos/skills`, so the managed `start-cli` and `startos-support` skills load without the agent being able to edit them.

---

## Network Access and Interfaces

| Interface     | ID   | Port | Protocol | Type | Purpose                              |
| ------------- | ---- | ---- | -------- | ---- | ------------------------------------ |
| Web Dashboard | `ui` | 9119 | HTTP     | ui   | In-browser chat + full management UI |

Messaging platforms reach the agent through their own webhooks/long-poll, configured in the dashboard. Hermes' **OpenAI-compatible API server** (an HTTP endpoint that lets external frontends like Open WebUI use Hermes as a model) is one such gateway platform — it is **off by default** and user-enabled from the dashboard's messaging/channels config, where Hermes requires an `API_SERVER_KEY` before it will start (it can dispatch terminal-capable agent work). This package does **not** force it on or export it as a StartOS interface; enabling and exposing it is left to the user.

**Authentication:** the dashboard carries the user's LLM API keys, the agent's terminal tool, and a `start-cli` that can administer this server, and StartOS does **not** authenticate a bound port unless the package asks it to (`addSsl.auth`). This package does not; the dashboard's own login is the gate. That gate is also what lets the dashboard bind at all — Hermes refuses a non-loopback bind with no auth provider registered.

Follows the [Prompt User to Create Admin Credentials](https://docs.start9.com/packaging/recipe-admin-credentials.html) recipe. `init/watchCredentials.ts` watches `config.yaml`'s `dashboard.basic_auth.password_hash` and raises a **critical** task when it is unset, which holds the service stopped until the user runs **Set Dashboard Password**. That action is the only place a credential is generated or written: it calls `utils.getDefaultString()`, writes `username` + `password_hash`, and returns the plaintext once. Nothing stores the plaintext. It is `allowedStatuses: 'only-stopped'`, so the new hash is always in place before the dashboard next reads it — no restart watch in `main`.

`hermesPasswordHash()` in `startos/utils.ts` reproduces upstream's `scrypt$N$r$p$<salt>$<key>` encoding (read from `plugins/dashboard_auth/basic.hash_password`, round-tripped against that module's `_verify_password` in both directions, and confirmed with a real login), so setting a password needs no subcontainer.

The action also writes `dashboard.basic_auth.secret`, the key Hermes signs session tokens with. Unset, Hermes mints a per-process key and every restart signs all users out. Because it is minted fresh on each password set, a reset revokes every live session — otherwise a session opened with a leaked password would outlive the reset, up to `session_ttl_seconds` (12h default).

> Do **not** reintroduce `--insecure`. Through 2026.6.19 it disabled the auth gate and served the dashboard unauthenticated to the whole local network; as of upstream 2026.7.1 it is a documented no-op.

The `ui` interface points at `/login` rather than `/`, working around an upstream auto-SSO bug — see [`TODO.md`](./TODO.md).

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

| Action                          | Purpose                                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Set Dashboard Password**      | Generate a new random Web Dashboard password, write its scrypt hash to `config.yaml`'s `dashboard.basic_auth`, and return it once. Covers first-set and rotation. `only-stopped`.                                                                                                                                         |
| **Configure Provider**          | Select the LLM backend (OpenAI-compatible, OpenAI Codex OAuth, Gemini, Grok, Anthropic, or local Ollama/vLLM/llama.cpp) and write it into `config.yaml`/`.env`/`auth.json`. For OpenAI Codex OAuth, starts the browser device-code login and creates the follow-up completion task. Toggles the local-backend dependency. |
| **Complete OpenAI Codex OAuth** | Finish a pending OpenAI Codex browser login by polling OpenAI for approval, exchanging the device-code response for tokens, writing `auth.json`, and restarting Hermes.                                                                                                                                                   |
| **Login to StartOS**            | Install the StartOS root CA and authenticate the bundled `start-cli` against this server (asks for the master password). **Grants the agent root-equivalent control** — gated behind a warning.                                                                                                                           |
| **Revoke StartOS Access**       | Un-enroll Hermes' `start-cli` identity key from the server (best-effort) and delete it from the data volume. Use this to revoke server-administration access; run **Login to StartOS** again to grant it back.                                                                                                            |

---

## Dependencies

All are declared `optional` in the manifest and flipped to **running** dependencies by `setupDependencies` based on the Configure Provider selection (`startos/dependencies.ts`). Cloud providers need no dependency.

| Dependency  | Version range  | When required                                  |
| ----------- | -------------- | ---------------------------------------------- |
| `ollama`    | `>=0.21.0:0`   | Backend set to Ollama                          |
| `vllm`      | `>=0.16.0:0.1` | Backend set to vLLM                            |
| `llama-cpp` | `>=1.0.9544:0` | Backend set to llama.cpp (the keyless release) |

---

## Backups and Restore

**Included in backup:**

- `main` volume — all Hermes data (config, sessions, memory, skills state, live knowledge bundle).

**Restore behavior:** the volume is fully restored before the service starts; the image-owned skills/baseline bundle come from the image, not the backup.

---

## Health Checks

| Check             | Method                                                                                                                         | Messages                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Web Dashboard     | `checkWebUrl` on `:9119/api/status` — upstream's exact-match public probe path; every other endpoint 401s behind the auth gate | Success: "The dashboard is ready" / Error: "The dashboard is not ready"                                            |
| Messaging Gateway | gateway-process liveness via upstream `gateway.status.get_running_pid` (the signal the dashboard itself uses)                  | Success: "The messaging gateway is running" / Error: "The messaging gateway is not running"                        |
| LLM Provider      | Runs Hermes' `resolve_runtime_provider()` in the venv                                                                          | Success: "An LLM provider is configured" / Error: "No LLM provider configured — run the Configure Provider action" |
| Knowledge Bundle  | `test -f` on the live bundle                                                                                                   | Success: "The support knowledge bundle is present" / Error: "The support knowledge bundle is not present"          |

---

## Limitations and Differences

1. **Root-equivalent capability.** After **Login to StartOS**, the agent's `start-cli` skill can run any server command (uninstall services, change config, etc.) with no built-in confirmation step. The `instructions.md` warning and the _Login to StartOS_ task/action warning gate this — keep them intact. **Revoke StartOS Access** un-enrolls and removes the stored `start-cli` identity key if you later want to cut off that access. Do not install on a server holding important data or keys (e.g. LND/CLN).
2. **Cloud-provider privacy.** With a cloud backend, every prompt and its context leave the device. Use Ollama, vLLM, or llama.cpp to keep inference on-device.
3. **No web-terminal wrapper.** The Hermes dashboard's Chat tab is already the full TUI in the browser, so this package does not add the Node web-terminal / Host-rewrite proxy that the Umbrel build needs — the upstream binaries are exposed directly.
4. **MCP is a future upgrade.** Live StartOS tools over the Model Context Protocol are not wired yet; server administration is via the `start-cli` skill and support is via the `startos-support` docs-search skill over the bundle.
5. **Support-docs scope.** The bundled knowledge covers StartOS, StartTunnel, and registry packages — not the s9pk Packaging book or Bitcoin Guides.
6. **Dashboard auth is delegated to StartOS.** The dashboard runs with `--insecure` — its built-in OAuth gate is off, and StartOS's authenticated `ui` interface is the sole access control (the container port is never exposed directly).

---

## What Is Unchanged from Upstream

- The `dashboard` and `gateway` are the **upstream Hermes binaries**, run as-is.
- All Hermes features: in-browser chat, config editor, sessions/memory, skill system, analytics, cron, and the full set of messaging-platform integrations.
- Hermes' own `config.yaml` / `.env` schema and provider model.

---

## Contributing

Build and development workflow follow the StartOS packaging guide: <https://docs.start9.com/packaging>. Keep `README.md`, `instructions.md`, and `AGENTS.md` in sync with any change to user-visible behavior or package structure. See [UPDATING.md](./UPDATING.md) for bumping the upstream version.

---

## Quick Reference for AI Consumers

```yaml
package_id: hermes-agent
image: nousresearch/hermes-agent (official upstream, not forked)
architectures:
  - x86_64
  - aarch64
volumes:
  main: /opt/data
interfaces:
  ui: 9119 # Web Dashboard (chat + management)
optional_gateway_platforms:
  api_server: # OpenAI-compatible HTTP API (default port 8642); off by default, user-enabled in dashboard (requires API_SERVER_KEY); not exported as a StartOS interface
image_owned_context:
  skills: /opt/startos/skills
  baseline_bundle: /opt/startos/knowledge/bundle.json
provider_config: # written by Configure Provider into config.yaml `model`
  keys: model.provider, model.base_url, model.api_key, model.default
  named_provider_key_envs: GEMINI_API_KEY, ANTHROPIC_API_KEY # named providers keyed via .env
  codex_oauth_tokens: auth.json providers.openai-codex.tokens # generated by browser device-code flow
  codex_oauth_pending: .startos/store.json codexOAuth # temporary device-code state
  vllm_key: read from vllm:public/credentials.json # ollama + llama.cpp are keyless
dependencies: # optional; flipped to running by Configure Provider
  ollama: '>=0.21.0:0'
  vllm: '>=0.16.0:0.1'
  llama-cpp: '>=1.0.9544:0'
actions:
  - Configure Provider
  - Complete OpenAI Codex OAuth
  - Login to StartOS # grants root-equivalent control
  - Revoke StartOS Access # removes stored start-cli authentication
health_checks:
  - Web Dashboard
  - Messaging Gateway
  - LLM Provider
  - Knowledge Bundle
```
