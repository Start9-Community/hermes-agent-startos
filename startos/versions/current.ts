import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.19:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.19 (upstream 0.20.5), a stable patch release rolling up roughly 323 merged pull requests since 2026.8.18.

Most relevant to this package: keyless web search now works on fresh installs, execution-discipline and runtime-stall guards improve agent reliability, and cron jobs gain persistent memory and per-job reasoning controls. This release also adds group-room Bot Mode threads and PDF/file attachments.

Full upstream changes: https://github.com/NousResearch/hermes-agent/compare/v2026.8.18...v2026.8.19`,
    es_ES: `Hermes Agent actualizado a 2026.8.19 (upstream 0.20.5), una versión estable de parche que agrupa unas 323 solicitudes de incorporación fusionadas desde 2026.8.18.

Lo más relevante para este paquete: la búsqueda web sin claves ahora funciona en instalaciones nuevas, las protecciones de disciplina de ejecución y de bloqueo en tiempo de ejecución mejoran la fiabilidad del agente, y los trabajos cron obtienen memoria persistente y controles de razonamiento por trabajo. Esta versión también añade hilos de Bot Mode en salas de grupo y archivos adjuntos PDF.

Todos los cambios originales: https://github.com/NousResearch/hermes-agent/compare/v2026.8.18...v2026.8.19`,
    de_DE: `Hermes Agent auf 2026.8.19 aktualisiert (Upstream 0.20.5), eine stabile Patch-Version mit rund 323 zusammengeführten Pull Requests seit 2026.8.18.

Für dieses Paket besonders relevant: Die schlüssellose Websuche funktioniert jetzt bei Neuinstallationen, Schutzmechanismen für Ausführungsdisziplin und Laufzeitstillstände erhöhen die Zuverlässigkeit des Agenten, und Cron-Aufträge erhalten dauerhaften Speicher sowie auftragsspezifische Steuerungen für den Denkaufwand. Diese Version ergänzt außerdem Bot-Mode-Threads in Gruppenräumen und PDF-/Dateianhänge.

Alle Änderungen im Originalprojekt: https://github.com/NousResearch/hermes-agent/compare/v2026.8.18...v2026.8.19`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.8.19 (upstream 0.20.5), stabilnego wydania poprawkowego obejmującego około 323 scalone pull requesty od wersji 2026.8.18.

Najistotniejsze dla tego pakietu: bezkluczowe wyszukiwanie w sieci działa teraz w nowych instalacjach, zabezpieczenia dyscypliny wykonywania i przestojów środowiska uruchomieniowego zwiększają niezawodność agenta, a zadania cron otrzymują trwałą pamięć i indywidualne sterowanie nakładem rozumowania. Wydanie dodaje także wątki Bot Mode w pokojach grupowych oraz załączniki PDF i plikowe.

Pełna lista zmian w projekcie źródłowym: https://github.com/NousResearch/hermes-agent/compare/v2026.8.18...v2026.8.19`,
    fr_FR: `Hermes Agent mis à jour vers 2026.8.19 (amont 0.20.5), une version corrective stable regroupant environ 323 demandes de tirage fusionnées depuis 2026.8.18.

Le plus pertinent pour ce paquet : la recherche web sans clé fonctionne désormais sur les nouvelles installations, les protections de discipline d’exécution et de blocage à l’exécution améliorent la fiabilité de l’agent, et les tâches cron bénéficient d’une mémoire persistante et de réglages de raisonnement par tâche. Cette version ajoute également les fils Bot Mode dans les salons de groupe ainsi que les pièces jointes PDF et fichiers.

Ensemble des modifications en amont : https://github.com/NousResearch/hermes-agent/compare/v2026.8.18...v2026.8.19`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
