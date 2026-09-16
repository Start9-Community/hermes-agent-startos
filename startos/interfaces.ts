import { sdk } from './sdk'
import { dashboardPort } from './utils'
import { i18n } from './i18n'

// Host id (the sdk.MultiHost.of group) — distinct from the interface id exported on it.
export const uiHostId = 'ui-multi'
export const uiInterfaceId = 'ui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, uiHostId)
  const uiMultiOrigin = await uiMulti.bindPort(dashboardPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web Dashboard'),
    id: uiInterfaceId,
    description: i18n(
      'The Hermes dashboard: in-browser chat plus configuration, sessions, skills, logs, analytics, and cron scheduling',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    // Upstream now excludes password providers from automatic OAuth redirects.
    path: '',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
