import { sdk } from '../sdk'
import { completeCodexOAuth } from './completeCodexOAuth'
import { configureProvider } from './configureProvider'
import { loginToOs } from './loginToOs'

export const actions = sdk.Actions.of()
  .addAction(configureProvider)
  .addAction(completeCodexOAuth)
  .addAction(loginToOs)
