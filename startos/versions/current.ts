import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.9.24:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.9.24 (upstream 0.21.5). Since the 2026.9.14 package, upstream adds a gateway singleton, connector setup, structured CLI streaming, automatic skill loading, Desktop plugin APIs and interface improvements, and broad profile, cron, Kanban, state-database and gateway fixes. New providers, plugins and integrations remain optional and require their own setup.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24`,
    es_ES: `Hermes Agent actualizado a 2026.9.24 (upstream 0.21.5). Desde el paquete 2026.9.14, añade una puerta de enlace única, configuración de conectores, streaming estructurado del CLI, carga automática de habilidades, API de plugins y mejoras de Desktop, y correcciones de perfiles, cron, Kanban, base de datos y puerta de enlace. Los nuevos proveedores, plugins e integraciones siguen siendo opcionales.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24`,
    de_DE: `Hermes Agent auf 2026.9.24 (Upstream 0.21.5) aktualisiert. Seit dem Paket 2026.9.14 gibt es einen einzelnen Gateway-Prozess, Connector-Einrichtung, strukturiertes CLI-Streaming, automatisches Laden von Skills, Desktop-Plugin-APIs und Oberflächenverbesserungen sowie Korrekturen für Profile, Cron, Kanban, Datenbank und Gateway. Neue Anbieter, Plugins und Integrationen bleiben optional.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24`,
    pl_PL: `Hermes Agent zaktualizowano do 2026.9.24 (upstream 0.21.5). Od pakietu 2026.9.14 dodano pojedynczą bramę, konfigurację łączników, strumieniowanie strukturalne CLI, automatyczne ładowanie umiejętności, API wtyczek Desktop i ulepszenia interfejsu oraz poprawki profili, cron, Kanban, bazy danych i bramy. Nowi dostawcy, wtyczki i integracje pozostają opcjonalne.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24`,
    fr_FR: `Hermes Agent mis à jour vers 2026.9.24 (amont 0.21.5). Depuis le paquet 2026.9.14, il ajoute une passerelle unique, la configuration des connecteurs, le streaming CLI structuré, le chargement automatique des compétences, les API de plugins et améliorations Desktop, et des correctifs pour les profils, cron, Kanban, la base de données et la passerelle. Les nouveaux fournisseurs, plugins et intégrations restent facultatifs.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
