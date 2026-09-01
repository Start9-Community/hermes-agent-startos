import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.31:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.31 (upstream 0.21.0), the Pantheon major release.

Highlights include built-in Bot Mode with named agents and group chats, cron continuity and memory, live subagent steering, expanded MCP management, and desktop browser control. It also includes all 0.20.x reliability and security fixes.

Full upstream release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    es_ES: `Hermes Agent actualizado a 2026.8.31 (upstream 0.21.0), la versión principal Pantheon.

Incluye Bot Mode integrado con agentes identificados y chats de grupo, continuidad y memoria para cron, control en directo de subagentes, gestión MCP ampliada y control del navegador de escritorio. También incorpora todas las correcciones de fiabilidad y seguridad de la serie 0.20.x.

Vollständige Originalversion: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    de_DE: `Hermes Agent auf 2026.8.31 aktualisiert (Upstream 0.21.0), das große Pantheon-Release.

Zu den Höhepunkten gehören der integrierte Bot Mode mit benannten Agenten und Gruppenchats, Cron-Kontinuität und -Speicher, Live-Steuerung von Subagenten, erweiterte MCP-Verwaltung und Desktop-Browsersteuerung. Alle Zuverlässigkeits- und Sicherheitskorrekturen der Reihe 0.20.x sind ebenfalls enthalten.

Pełne wydanie źródłowe: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.8.31 (upstream 0.21.0), głównego wydania Pantheon.

Najważniejsze zmiany to wbudowany Bot Mode z nazwanymi agentami i czatami grupowymi, ciągłość i pamięć zadań cron, sterowanie podagentami na żywo, rozszerzone zarządzanie MCP oraz sterowanie przeglądarką pulpitu. Wydanie zawiera również wszystkie poprawki niezawodności i bezpieczeństwa z serii 0.20.x.

Version amont complète : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    fr_FR: `Hermes Agent mis à jour vers 2026.8.31 (amont 0.21.0), la version majeure Pantheon.

Les points forts comprennent Bot Mode intégré avec agents nommés et discussions de groupe, la continuité et la mémoire des tâches cron, le pilotage en direct des sous-agents, une gestion MCP étendue et le contrôle du navigateur de bureau. Toutes les corrections de fiabilité et de sécurité de la série 0.20.x sont également incluses.

Version amont complète : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
