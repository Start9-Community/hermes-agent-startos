import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.9.21:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.9.21 (upstream 0.21.4), a stable rollup of more than 5,000 commits. Adds a host-wide gateway singleton, backend-owned connector setup, structured CLI streaming, automatic skill loading, bounded MCP discovery and journal-mode controls; includes extensive profile, multiplex, cron, Kanban and state-database fixes. Bundled start-cli 2.1.0 adds shell completions, login on demand and bridge addresses; setup install-os now requires stable disk paths.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.21`,
    es_ES: `Hermes Agent actualizado a 2026.9.21 (upstream 0.21.4), una versión estable que reúne más de 5.000 commits. Añade una única puerta de enlace por host, configuración de conectores en el backend, streaming estructurado del CLI, carga automática de habilidades, descubrimiento MCP limitado y control del modo de diario; incluye numerosas correcciones de perfiles, multiplexación, cron, Kanban y la base de datos de estado. start-cli 2.1.0 añade autocompletado, inicio de sesión bajo demanda y direcciones de puente; setup install-os ahora exige rutas de disco estables.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.21`,
    de_DE: `Hermes Agent auf 2026.9.21 (Upstream 0.21.4) aktualisiert, ein stabiles Rollup von mehr als 5.000 Commits. Ergänzt einen hostweiten Gateway-Singleton, backendgesteuerte Connector-Einrichtung, strukturiertes CLI-Streaming, automatisches Laden von Skills, begrenzte MCP-Erkennung und Journalmodus-Steuerung; enthält zahlreiche Korrekturen für Profile, Multiplexing, Cron, Kanban und die Statusdatenbank. start-cli 2.1.0 ergänzt Shell-Vervollständigung, Anmeldung bei Bedarf und Bridge-Adressen; setup install-os verlangt nun stabile Datenträgerpfade.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.21`,
    pl_PL: `Zaktualizowano Hermes Agent do 2026.9.21 (upstream 0.21.4), stabilnego wydania obejmującego ponad 5.000 commitów. Dodano pojedynczą bramę na host, konfigurację łączników po stronie backendu, strumieniowanie strukturalne CLI, automatyczne ładowanie umiejętności, ograniczone wykrywanie MCP i sterowanie trybem dziennika; wydanie zawiera liczne poprawki profili, multipleksowania, cron, Kanban i bazy stanu. start-cli 2.1.0 dodaje uzupełnianie poleceń, logowanie na żądanie i adresy mostów; setup install-os wymaga teraz stabilnych ścieżek dysków.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.21`,
    fr_FR: `Hermes Agent mis à jour vers 2026.9.21 (amont 0.21.4), une version stable regroupant plus de 5 000 commits. Ajoute un singleton de passerelle par hôte, la configuration des connecteurs côté backend, le streaming CLI structuré, le chargement automatique des compétences, la découverte MCP bornée et le contrôle du mode de journal ; comprend de nombreux correctifs pour les profils, le multiplexage, cron, Kanban et la base d’état. start-cli 2.1.0 ajoute l’autocomplétion, la connexion à la demande et les adresses de pont ; setup install-os exige désormais des chemins de disque stables.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.21`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
