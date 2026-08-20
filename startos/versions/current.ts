import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.18:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.18 (upstream 0.20.4). This rolls up two upstream patch releases — 0.20.3 and 0.20.4 — totalling roughly 199 merged pull requests since 2026.8.16.

Most relevant to this package: the cron scheduler now heals itself (stale-claim reconciliation, wedged-job re-arm, and recovery from file-descriptor exhaustion), Kanban gains worktree and dispatch fixes, and the session database resolves event-loop-thread and contention problems. MCP support moves to the 2.x SDK and speaks the stateless protocol.

Full upstream changes: https://github.com/NousResearch/hermes-agent/compare/v2026.8.16...v2026.8.18`,
    es_ES: `Hermes Agent actualizado a 2026.8.18 (upstream 0.20.4). Agrupa dos versiones de parche originales — 0.20.3 y 0.20.4 — con unas 199 solicitudes de incorporación fusionadas desde 2026.8.16.

Lo más relevante para este paquete: el planificador de cron ahora se repara solo (reconciliación de reclamaciones obsoletas, rearmado de trabajos atascados y recuperación ante el agotamiento de descriptores de archivo), Kanban recibe correcciones de worktree y de despacho, y la base de datos de sesiones resuelve problemas de hilo del bucle de eventos y de contención. La compatibilidad con MCP pasa al SDK 2.x y habla el protocolo sin estado.

Todos los cambios originales: https://github.com/NousResearch/hermes-agent/compare/v2026.8.16...v2026.8.18`,
    de_DE: `Hermes Agent auf 2026.8.18 aktualisiert (Upstream 0.20.4). Damit werden zwei Upstream-Patch-Versionen — 0.20.3 und 0.20.4 — mit rund 199 zusammengeführten Pull Requests seit 2026.8.16 gebündelt.

Für dieses Paket besonders relevant: Der Cron-Planer repariert sich nun selbst (Abgleich veralteter Ansprüche, Neustart festgefahrener Jobs und Erholung nach erschöpften Dateideskriptoren), Kanban erhält Worktree- und Dispatch-Korrekturen, und die Sitzungsdatenbank behebt Probleme mit dem Event-Loop-Thread und mit Nebenläufigkeit. Die MCP-Unterstützung wechselt auf das 2.x-SDK und beherrscht das zustandslose Protokoll.

Alle Änderungen im Originalprojekt: https://github.com/NousResearch/hermes-agent/compare/v2026.8.16...v2026.8.18`,
    pl_PL: `Zaktualizowano Hermes Agent do wersji 2026.8.18 (upstream 0.20.4). Wydanie zbiera dwie poprawkowe wersje źródłowe — 0.20.3 i 0.20.4 — obejmujące około 199 scalonych pull requestów od wersji 2026.8.16.

Najistotniejsze dla tego pakietu: harmonogram cron potrafi teraz naprawiać się sam (uzgadnianie nieaktualnych roszczeń, ponowne uzbrajanie zablokowanych zadań oraz powrót do działania po wyczerpaniu deskryptorów plików), Kanban otrzymuje poprawki worktree i wysyłki zadań, a baza danych sesji rozwiązuje problemy z wątkiem pętli zdarzeń i rywalizacją o dostęp. Obsługa MCP przechodzi na SDK 2.x i korzysta z protokołu bezstanowego.

Pełna lista zmian w projekcie źródłowym: https://github.com/NousResearch/hermes-agent/compare/v2026.8.16...v2026.8.18`,
    fr_FR: `Hermes Agent mis à jour vers 2026.8.18 (amont 0.20.4). Cette version regroupe deux correctifs amont — 0.20.3 et 0.20.4 — soit environ 199 demandes de tirage fusionnées depuis 2026.8.16.

Le plus pertinent pour ce paquet : le planificateur cron se répare désormais lui-même (réconciliation des revendications obsolètes, réarmement des tâches bloquées et reprise après épuisement des descripteurs de fichiers), Kanban bénéficie de correctifs de worktree et de répartition, et la base de données de sessions corrige des problèmes de thread de boucle d'événements et de contention. La prise en charge de MCP passe au SDK 2.x et utilise le protocole sans état.

Ensemble des modifications en amont : https://github.com/NousResearch/hermes-agent/compare/v2026.8.16...v2026.8.18`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
