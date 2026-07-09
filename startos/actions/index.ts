import { sdk } from '../sdk'
import { completeCodexOAuth } from './completeCodexOAuth'
import { configureProvider } from './configureProvider'
import { loginToOs } from './loginToOs'
import { revokeStartOsAccess } from './revokeStartOsAccess'
import { setDashboardPassword } from './setDashboardPassword'

export const actions = sdk.Actions.of()
  .addAction(setDashboardPassword)
  .addAction(configureProvider)
  .addAction(completeCodexOAuth)
  .addAction(loginToOs)
  .addAction(revokeStartOsAccess)
