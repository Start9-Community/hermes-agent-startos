import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.9.14:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.9.14 (upstream 0.21.3), including 0.21.2. Fixes session database locking, corruption recovery and duplicate writer handles; strengthens profile and credential isolation; repairs queued delivery, cron scheduling and provider fallback; adds the credential vault and pinned plugin catalog. Remote dashboard refresh requests are coalesced and no longer block health responses.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.14`,
    es_ES: `Hermes Agent actualizado a 2026.9.14 (upstream 0.21.3), incluida la versión 0.21.2. Corrige bloqueos, recuperación y escritores duplicados de la base de datos; refuerza el aislamiento de perfiles y credenciales; repara entregas en cola, cron y proveedores alternativos; añade la bóveda de credenciales y el catálogo de plugins fijados. La renovación de sesiones remotas agrupa solicitudes y ya no bloquea las respuestas de salud.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.14`,
    de_DE: `Hermes Agent auf 2026.9.14 aktualisiert (Upstream 0.21.3), einschließlich 0.21.2. Behebt Datenbanksperren, Wiederherstellung und doppelte Schreibzugriffe; verbessert Profil- und Zugangsdatenisolation, Warteschlangenzustellung, Cron und Anbieter-Fallback; ergänzt den Zugangsdaten-Tresor und den versionsgebundenen Plugin-Katalog. Parallele Dashboard-Sitzungsaktualisierungen werden gebündelt und blockieren keine Statusantworten mehr.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.14`,
    pl_PL: `Zaktualizowano Hermes Agent do 2026.9.14 (upstream 0.21.3), wraz z 0.21.2. Naprawia blokady, odzyskiwanie i powielone połączenia zapisu bazy sesji; wzmacnia izolację profili i poświadczeń; poprawia kolejkę dostarczania, cron i przełączanie dostawców; dodaje sejf poświadczeń i katalog przypiętych wtyczek. Odświeżanie sesji zdalnego pulpitu łączy równoległe żądania i nie blokuje odpowiedzi stanu.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.14`,
    fr_FR: `Hermes Agent mis à jour vers 2026.9.14 (amont 0.21.3), avec 0.21.2. Corrige les verrous, la récupération et les accès en écriture dupliqués de la base de sessions ; renforce l’isolation des profils et identifiants ; répare la livraison en attente, cron et le basculement des fournisseurs ; ajoute le coffre d’identifiants et le catalogue de plugins épinglés. Le renouvellement des sessions distantes regroupe les requêtes et ne bloque plus les réponses de santé.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.14`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
