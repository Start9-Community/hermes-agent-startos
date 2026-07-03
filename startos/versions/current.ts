import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.7.1:2',
  releaseNotes: {
    en_US: 'Internal rework for start-sdk 2.0.',
    es_ES: 'Reelaboración interna para start-sdk 2.0.',
    de_DE: 'Interne Überarbeitung für start-sdk 2.0.',
    pl_PL: 'Wewnętrzna przebudowa pod start-sdk 2.0.',
    fr_FR: 'Refonte interne pour start-sdk 2.0.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
