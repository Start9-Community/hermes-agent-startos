import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.9.7:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.9.7 (upstream 0.21.1), a patch release that rolls up current upstream main since 2026.8.31.

The window covers codebase modularization, file-operation and startup performance work, provider and model updates, desktop session controls and browser annotations, MCP authorization improvements, cron scheduling and delivery fixes, and delegation reliability improvements. Upstream will publish full curated notes for this window with 0.22.0.

Full upstream release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7`,
    es_ES: `Hermes Agent actualizado a 2026.9.7 (upstream 0.21.1), una versión de mantenimiento que recoge la rama principal de upstream desde 2026.8.31.

El intervalo abarca la modularización del código, mejoras de rendimiento en operaciones de archivo y arranque, actualizaciones de proveedores y modelos, controles de sesión de escritorio y anotaciones del navegador, mejoras en la autorización MCP, correcciones de programación y entrega de cron, y mejoras de fiabilidad en la delegación. Upstream publicará las notas completas de este intervalo con la versión 0.22.0.

Versión completa de upstream: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7`,
    de_DE: `Hermes Agent auf 2026.9.7 aktualisiert (Upstream 0.21.1), ein Patch-Release, das den aktuellen Upstream-Hauptzweig seit 2026.8.31 zusammenfasst.

Der Zeitraum umfasst die Modularisierung der Codebasis, Leistungsverbesserungen bei Dateioperationen und Start, Aktualisierungen von Anbietern und Modellen, Desktop-Sitzungssteuerung und Browser-Anmerkungen, Verbesserungen der MCP-Autorisierung, Korrekturen an Cron-Planung und -Zustellung sowie Zuverlässigkeitsverbesserungen bei der Delegation. Upstream veröffentlicht die vollständigen Anmerkungen zu diesem Zeitraum mit 0.22.0.

Vollständige Originalversion: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.9.7 (upstream 0.21.1), wydania poprawkowego zbierającego bieżącą gałąź główną upstream od wersji 2026.8.31.

Zakres obejmuje modularyzację kodu, poprawę wydajności operacji na plikach i uruchamiania, aktualizacje dostawców i modeli, sterowanie sesjami pulpitu i adnotacje przeglądarki, usprawnienia autoryzacji MCP, poprawki harmonogramu i dostarczania zadań cron oraz zwiększenie niezawodności delegowania. Upstream opublikuje pełne notatki dla tego zakresu wraz z wersją 0.22.0.

Pełne wydanie źródłowe: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7`,
    fr_FR: `Hermes Agent mis à jour vers 2026.9.7 (amont 0.21.1), une version corrective qui regroupe la branche principale amont depuis 2026.8.31.

La période couvre la modularisation du code, les gains de performance sur les opérations de fichiers et le démarrage, les mises à jour de fournisseurs et de modèles, les contrôles de session de bureau et les annotations du navigateur, les améliorations de l'autorisation MCP, les corrections de planification et de distribution des tâches cron, ainsi que les améliorations de fiabilité de la délégation. L'amont publiera les notes complètes de cette période avec la version 0.22.0.

Version amont complète : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
