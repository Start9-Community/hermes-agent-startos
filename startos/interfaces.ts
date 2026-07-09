import { sdk } from './sdk'
import { dashboardPort } from './utils'
import { i18n } from './i18n'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiMultiOrigin = await uiMulti.bindPort(dashboardPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web Dashboard'),
    id: 'ui',
    description: i18n(
      'The Hermes dashboard: in-browser chat plus configuration, sessions, skills, logs, analytics, and cron scheduling',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    // Land on the login form rather than `/`. Hermes' auth gate skips the login
    // interstitial when exactly one provider is registered, redirecting straight
    // into `/auth/login?provider=…` — the OAuth-initiation route. With basic_auth
    // as the only provider that route raises NotImplementedError, so an
    // unauthenticated `/` serves a 500 (recovering only on reload, via the gate's
    // one-shot loop guard). `/login` is in upstream's public-path allowlist and
    // renders the credential form directly. Revert to '' once upstream excludes
    // password-only providers from auto-SSO — see TODO.md.
    path: '/login',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
