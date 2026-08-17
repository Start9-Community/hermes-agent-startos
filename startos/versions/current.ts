import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.16:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.16 (upstream 0.20.2), a patch release rolling up roughly 397 merged pull requests since 2026.8.13 — fixes across the desktop app, the CLI, the gateway, cron and the installers. Upstream is publishing curated notes for this whole window with 0.21.0.

Also requests the StartOS root certificate against an address the OS still issues for, rather than the retired service-hostname form. That certificate is what lets the agent talk to your server, and it is installed on every start.

Full upstream changes: https://github.com/NousResearch/hermes-agent/compare/v2026.8.13...v2026.8.16`,
    es_ES: `Hermes Agent actualizado a 2026.8.16 (upstream 0.20.2), una versión de parche que agrupa unas 397 solicitudes de incorporación fusionadas desde 2026.8.13: correcciones en la aplicación de escritorio, la CLI, la pasarela, cron y los instaladores. Upstream publicará las notas detalladas de toda esta ventana con la 0.21.0.

Además, solicita el certificado raíz de StartOS para una dirección que el sistema aún emite, en lugar del formato de nombre de host de servicio retirado. Ese certificado es lo que permite al agente comunicarse con tu servidor y se instala en cada arranque.

Todos los cambios originales: https://github.com/NousResearch/hermes-agent/compare/v2026.8.13...v2026.8.16`,
    de_DE: `Hermes Agent auf 2026.8.16 aktualisiert (Upstream 0.20.2), eine Patch-Version, die rund 397 zusammengeführte Pull Requests seit 2026.8.13 bündelt — Korrekturen in der Desktop-App, der CLI, dem Gateway, bei Cron und den Installationsprogrammen. Upstream veröffentlicht die ausführlichen Hinweise zu diesem gesamten Zeitraum mit 0.21.0.

Fordert außerdem das StartOS-Stammzertifikat für eine Adresse an, für die das System weiterhin ausstellt, statt für die ausgemusterte Dienst-Hostnamen-Form. Dieses Zertifikat ermöglicht dem Agenten die Kommunikation mit Ihrem Server und wird bei jedem Start installiert.

Alle Änderungen im Originalprojekt: https://github.com/NousResearch/hermes-agent/compare/v2026.8.13...v2026.8.16`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.8.16 (upstream 0.20.2) — wydanie poprawkowe zbierające około 397 scalonych pull requestów od wersji 2026.8.13: poprawki w aplikacji desktopowej, CLI, bramie, cronie i instalatorach. Upstream opublikuje szczegółowe informacje o całym tym okresie wraz z wersją 0.21.0.

Ponadto żąda certyfikatu głównego StartOS dla adresu, dla którego system nadal wystawia certyfikaty, zamiast wycofanej formy nazwy hosta usługi. To właśnie ten certyfikat umożliwia agentowi komunikację z serwerem i jest instalowany przy każdym uruchomieniu.

Pełna lista zmian w projekcie źródłowym: https://github.com/NousResearch/hermes-agent/compare/v2026.8.13...v2026.8.16`,
    fr_FR: `Hermes Agent mis à jour vers 2026.8.16 (amont 0.20.2), une version corrective qui regroupe environ 397 demandes de tirage fusionnées depuis 2026.8.13 : correctifs dans l'application de bureau, la CLI, la passerelle, cron et les installateurs. L'amont publiera les notes détaillées de toute cette période avec la 0.21.0.

Demande également le certificat racine de StartOS pour une adresse que le système délivre encore, plutôt que pour la forme de nom d'hôte de service retirée. Ce certificat est ce qui permet à l'agent de dialoguer avec votre serveur, et il est installé à chaque démarrage.

Ensemble des modifications en amont : https://github.com/NousResearch/hermes-agent/compare/v2026.8.13...v2026.8.16`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
