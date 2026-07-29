import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { dataDir, mainMounts } from '../utils'

const startCliAuthPaths = [
  `${dataDir}/.startos/id.key.pem`,
  `${dataDir}/.startos/developer.key.pem`,
  `${dataDir}/.startos/.cookies.json`,
  `${dataDir}/.startos/.cookies.json.tmp`,
]

export const revokeStartOsAccess = sdk.Action.withoutInput(
  'revoke-startos-access',

  async ({ effects }) => ({
    name: i18n('Revoke StartOS Access'),
    description: i18n(
      "Remove Hermes' stored start-cli authentication so it can no longer administer this StartOS server",
    ),
    warning: i18n(
      'Hermes will lose StartOS administrative access until you run Login to StartOS again.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'hermes-agent' },
      mainMounts(),
      'start-cli-revoke',
      async (subc) => {
        await subc.execFail(['rm', '-f', ...startCliAuthPaths], {
          user: 'root',
        })
      },
    )

    return {
      version: '1' as const,
      title: i18n('StartOS Access Revoked'),
      message: i18n(
        "Hermes' stored start-cli authentication was removed. Run Login to StartOS to grant access again.",
      ),
      result: null,
    }
  },
)
