import { setDashboardPassword } from '../actions/setDashboardPassword'
import { configYaml } from '../fileModels/configYaml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

/**
 * Hermes' dashboard binds the LXC bridge, and its auth gate fails closed on a
 * non-loopback bind with no auth provider registered — so the service genuinely
 * cannot run until a password exists. Surfacing this as a `critical` task is what
 * holds the service stopped until the user sets one, which also covers upgrading
 * from a release that served the dashboard unauthenticated.
 */
export const watchCredentials = sdk.setupOnInit(async (effects) => {
  const passwordHash = await configYaml
    .read((c) => c.dashboard?.basic_auth?.password_hash)
    .const(effects)

  if (!passwordHash) {
    await sdk.action.createOwnTask(effects, setDashboardPassword, 'critical', {
      reason: i18n('Set a password before signing in to the Hermes dashboard'),
    })
  }
})
