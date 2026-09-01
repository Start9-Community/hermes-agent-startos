import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.31:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.31 (upstream 0.21.0, the Pantheon release).

Highlights include persistent cron memory and continuity, live subagent steering, stronger provider and stalled-stream recovery, gateway control and replay improvements, expanded MCP management, and broad security hardening.

Full upstream changes: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    es_ES: `Hermes Agent actualizado a 2026.8.31 (upstream 0.21.0, la versión Pantheon).

Incluye memoria y continuidad persistentes para cron, control en vivo de subagentes, recuperación mejorada de proveedores y flujos bloqueados, mejoras de control y repetición de la pasarela, gestión MCP ampliada y un refuerzo general de seguridad.

Todos los cambios originales: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    de_DE: `Hermes Agent auf 2026.8.31 aktualisiert (Upstream 0.21.0, das Pantheon-Release).

Zu den wichtigsten Neuerungen gehören dauerhafter Cron-Speicher und Kontinuität, Live-Steuerung von Subagenten, robustere Wiederherstellung bei Anbieter- und Stream-Ausfällen, Verbesserungen an Gateway-Steuerung und Replay, erweitertes MCP-Management und umfassende Sicherheitshärtung.

Alle Änderungen im Originalprojekt: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.8.31 (upstream 0.21.0, wydanie Pantheon).

Najważniejsze zmiany obejmują trwałą pamięć i ciągłość zadań cron, sterowanie podagentami na żywo, lepsze odzyskiwanie po awariach dostawców i zatrzymanych strumieni, ulepszenia kontroli i odtwarzania bramy, rozszerzone zarządzanie MCP oraz szerokie wzmocnienia bezpieczeństwa.

Pełna lista zmian w projekcie źródłowym: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
    fr_FR: `Hermes Agent mis à jour vers 2026.8.31 (amont 0.21.0, version Pantheon).

Les points forts comprennent la mémoire persistante et la continuité des tâches cron, le pilotage en direct des sous-agents, une meilleure reprise face aux fournisseurs et flux bloqués, des améliorations du contrôle et de la relecture de la passerelle, une gestion MCP étendue et un renforcement général de la sécurité.

Ensemble des modifications en amont : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
