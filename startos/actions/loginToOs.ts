import { sdk } from '../sdk'
import { startCliConfigYaml } from '../fileModels/startCliConfig.yaml'
import { mainMounts, dataDir } from '../utils'
import { SubContainer, T } from '@start9labs/start-sdk'
import { appendFile } from 'fs/promises'
import { i18n } from '../i18n'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  masterPassword: Value.text({
    name: i18n('StartOS Master Password'),
    description: i18n('Your StartOS server master password'),
    required: true,
    default: null,
    placeholder: i18n('Enter master password'),
    masked: true,
  }),
})

export const loginToOs = sdk.Action.withInput(
  'login-to-os',

  async ({ effects }) => ({
    name: i18n('Login to StartOS'),
    description: i18n(
      'Authenticate start-cli so Hermes can administer this StartOS server',
    ),
    warning: i18n(
      'This grants Hermes root-equivalent control of your StartOS server through start-cli. Only do this on a server designated for development or experimentation.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({ masterPassword: '' }),

  async ({ effects, input }) => {
    const host = await startCliConfigYaml.read((c) => c?.host).once()
    if (!host) {
      throw new Error(
        i18n(
          'No host configured. The host URL is set automatically from the OS IP address.',
        ),
      )
    }

    const result = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'hermes-agent' },
      mainMounts(),
      'start-cli-login',
      async (subc) => {
        await installRootCA(effects, subc)
        // This action is allowed while the daemon is stopped, so establish the
        // volume ownership that its startup oneshot would otherwise repair.
        await subc.execFail(
          ['chown', '-R', '1000:1000', `${dataDir}/.startos`],
          { user: 'root' },
        )
        return subc.exec(['start-cli', 'auth', 'login'], {
          user: 'hermes',
          env: { HOME: dataDir, PASSWORD: input.masterPassword },
        })
      },
    )

    if (result.exitCode !== 0) {
      throw new Error(
        `Login failed: ${String(result.stderr || result.stdout || 'Unknown error')}`,
      )
    }

    return {
      version: '1' as const,
      title: i18n('Login Successful'),
      message: i18n('start-cli is now authenticated with your StartOS server.'),
      result: null,
    }
  },
)

export async function installRootCA(
  effects: T.Effects,
  subcontainer: SubContainer<typeof sdk.manifest>,
) {
  // Only the root of the chain is wanted, so the hostname requested is
  // immaterial — but it must be one the OS still issues for.
  const certs = await sdk.getSslCertificate(effects, ['127.0.0.1']).const()
  const [rootCa] = certs.slice(-1)

  await subcontainer.writeFile(
    '/usr/share/ca-certificates/startos-root-ca.crt',
    rootCa,
  )
  const rootfs = await subcontainer.rootfs
  await appendFile(
    `${rootfs}/etc/ca-certificates.conf`,
    'startos-root-ca.crt\n',
  )

  await subcontainer.execFail(['update-ca-certificates'], { user: 'root' })
}
