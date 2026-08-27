import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.27:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.27 (upstream 0.20.6), a stable patch release rolling up roughly 525 merged pull requests since 2026.8.19.

Most relevant to this package: cron incidents now persist until acknowledged with clearer version-skew failures, updaters pause gateways via a control socket instead of killing them mid-run, stored secrets gain OS-keychain encryption, and web search results are cached with TTLs. This release also adds an MCP catalog of 50+ live-verified vendor-hosted servers and a consent-gated browser mode.

Full upstream changes: https://github.com/NousResearch/hermes-agent/compare/v2026.8.19...v2026.8.27`,
    es_ES: `Hermes Agent actualizado a 2026.8.27 (upstream 0.20.6), una versión estable de parche que agrupa unas 525 solicitudes de incorporación fusionadas desde 2026.8.19.

Lo más relevante para este paquete: los incidentes de cron ahora persisten hasta ser confirmados, con fallos de desfase de versión más claros; los actualizadores pausan las pasarelas mediante un socket de control en lugar de terminarlas en plena ejecución; los secretos almacenados obtienen cifrado con el llavero del sistema; y los resultados de búsqueda web se almacenan en caché con TTL. Esta versión también añade un catálogo MCP con más de 50 servidores alojados por proveedores y verificados, y un modo de navegador con consentimiento.

Todos los cambios originales: https://github.com/NousResearch/hermes-agent/compare/v2026.8.19...v2026.8.27`,
    de_DE: `Hermes Agent auf 2026.8.27 aktualisiert (Upstream 0.20.6), eine stabile Patch-Version mit rund 525 zusammengeführten Pull Requests seit 2026.8.19.

Für dieses Paket besonders relevant: Cron-Vorfälle bleiben jetzt bis zur Bestätigung bestehen und Versionsabweichungen werden klarer gemeldet; Updater pausieren Gateways über einen Steuersocket, statt sie mitten im Lauf zu beenden; gespeicherte Geheimnisse erhalten Verschlüsselung über den Systemschlüsselbund; und Websuchergebnisse werden mit TTL zwischengespeichert. Diese Version ergänzt außerdem einen MCP-Katalog mit über 50 verifizierten, von Anbietern gehosteten Servern sowie einen zustimmungspflichtigen Browser-Modus.

Alle Änderungen im Originalprojekt: https://github.com/NousResearch/hermes-agent/compare/v2026.8.19...v2026.8.27`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.8.27 (upstream 0.20.6), stabilnego wydania poprawkowego obejmującego około 525 scalonych pull requestów od wersji 2026.8.19.

Najistotniejsze dla tego pakietu: incydenty zadań cron pozostają teraz widoczne do potwierdzenia, a błędy rozbieżności wersji są zgłaszane czytelniej; aktualizatory wstrzymują bramy przez gniazdo sterujące zamiast przerywać je w trakcie pracy; przechowywane sekrety zyskują szyfrowanie pękiem kluczy systemu; a wyniki wyszukiwania w sieci są buforowane z TTL. Wydanie dodaje także katalog MCP z ponad 50 zweryfikowanymi serwerami hostowanymi przez dostawców oraz tryb przeglądarki wymagający zgody.

Pełna lista zmian w projekcie źródłowym: https://github.com/NousResearch/hermes-agent/compare/v2026.8.19...v2026.8.27`,
    fr_FR: `Hermes Agent mis à jour vers 2026.8.27 (amont 0.20.6), une version corrective stable regroupant environ 525 demandes de tirage fusionnées depuis 2026.8.19.

Le plus pertinent pour ce paquet : les incidents cron persistent désormais jusqu'à leur acquittement, avec des échecs de décalage de version plus clairs ; les mises à jour mettent les passerelles en pause via un socket de contrôle au lieu de les interrompre en cours d'exécution ; les secrets stockés bénéficient du chiffrement par le trousseau du système ; et les résultats de recherche web sont mis en cache avec TTL. Cette version ajoute également un catalogue MCP de plus de 50 serveurs hébergés par des fournisseurs et vérifiés, ainsi qu'un mode navigateur soumis à consentement.

Ensemble des modifications en amont : https://github.com/NousResearch/hermes-agent/compare/v2026.8.19...v2026.8.27`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
