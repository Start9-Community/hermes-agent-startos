import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.6.5:1',
  releaseNotes: {
    en_US: 'Add browser-based OpenAI Codex OAuth provider setup.',
    es_ES:
      'Agrega configuracion de proveedor OpenAI Codex OAuth basada en navegador.',
    de_DE:
      'Browserbasierte Einrichtung des OpenAI Codex OAuth-Anbieters hinzugefuegt.',
    pl_PL:
      'Dodano konfiguracje dostawcy OpenAI Codex OAuth przez przegladarke.',
    fr_FR:
      'Ajoute la configuration du fournisseur OpenAI Codex OAuth via navigateur.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
