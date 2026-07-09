import { utils } from '@start9labs/start-sdk'
import { configYaml } from '../fileModels/configYaml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { dashboardUsername, hermesPasswordHash } from '../utils'

export const setDashboardPassword = sdk.Action.withoutInput(
  'set-dashboard-password',

  async () => ({
    name: i18n('Set Dashboard Password'),
    description: i18n(
      '<p>Generate a new random password for signing in to the Hermes web dashboard.</p><p>This action can only run while Hermes is stopped, so the dashboard loads the new password the next time it starts.</p>',
    ),
    warning: null,
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 32,
    })
    // `secret` signs Hermes' session tokens. Unset, Hermes mints a per-process key
    // and every restart signs all users out; stable, sessions outlive a restart —
    // including a restart that changed the password, so a leaked-password reset
    // would leave the attacker's session valid until its TTL. Minting a fresh
    // secret alongside each password revokes every live session on reset.
    // Upstream b64-decodes it: 44 chars → 33 bytes, over its documented 32 floor.
    await configYaml.merge(effects, {
      dashboard: {
        basic_auth: {
          username: dashboardUsername,
          password_hash: hermesPasswordHash(password),
          secret: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 44 }),
        },
      },
    })

    return {
      version: '1',
      title: i18n('Hermes Dashboard Login'),
      message: i18n(
        'Use these credentials to sign in to the Hermes web dashboard. This is the only time the password is shown — it is not stored in plaintext.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: dashboardUsername,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
