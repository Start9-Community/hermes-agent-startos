import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.3:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.3, the upstream 0.20.0 release adding conversational voice, grounded citations, signed webhooks, Agent-to-Agent support, new CLI workflows, smarter context compression, and broad reliability improvements.

The package continues to use start-sdk 2.0 and includes start-cli 1.1.0 with signing-key authentication.

Release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.3`,
    es_ES: `Actualiza Hermes Agent a 2026.8.3, la versión 0.20.0 de upstream que añade voz conversacional, citas verificables, webhooks firmados, compatibilidad entre agentes, nuevos flujos de trabajo de CLI, compresión de contexto mejorada y amplias mejoras de fiabilidad.

El paquete continúa usando start-sdk 2.0 e incluye start-cli 1.1.0 con autenticación mediante clave de firma.

Versión: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.3`,
    de_DE: `Aktualisiert Hermes Agent auf 2026.8.3, die Upstream-Version 0.20.0 mit Dialogsprache, belegbaren Zitaten, signierten Webhooks, Agent-to-Agent-Unterstützung, neuen CLI-Arbeitsabläufen, intelligenterer Kontextkomprimierung und umfangreichen Zuverlässigkeitsverbesserungen.

Das Paket verwendet weiterhin start-sdk 2.0 und enthält start-cli 1.1.0 mit Signaturschlüssel-Authentifizierung.

Veröffentlichung: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.3`,
    pl_PL: `Aktualizuje Hermes Agent do wersji upstream 0.20.0 z 2026.8.3, która dodaje konwersacyjną obsługę głosu, weryfikowalne cytowania, podpisane webhooki, obsługę Agent-to-Agent, nowe przepływy pracy CLI, inteligentniejszą kompresję kontekstu i liczne ulepszenia niezawodności.

Pakiet nadal używa start-sdk 2.0 i zawiera start-cli 1.1.0 z uwierzytelnianiem za pomocą klucza podpisującego.

Wydanie: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.3`,
    fr_FR: `Met à jour Hermes Agent vers la version amont 0.20.0 du 2026.8.3, qui ajoute la voix conversationnelle, des citations vérifiables, des webhooks signés, la prise en charge Agent-to-Agent, de nouveaux flux de travail CLI, une compression de contexte améliorée et de nombreuses améliorations de fiabilité.

Le paquet continue d'utiliser start-sdk 2.0 et inclut start-cli 1.1.0 avec authentification par clé de signature.

Version : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.3`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
