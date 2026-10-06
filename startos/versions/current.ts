import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.9.24:1',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.9.24 (upstream 0.21.5). Since the 2026.9.14 package, upstream adds a gateway singleton, connector setup, structured CLI streaming, automatic skill loading, Desktop plugin APIs and interface improvements, and broad profile, cron, Kanban, state-database and gateway fixes. New providers, plugins and integrations remain optional and require their own setup.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24

- Set Dashboard Password asks for confirmation before replacing an existing password, and says that everyone signed in to the dashboard is signed out.
- Complete OpenAI Codex OAuth asks for confirmation before restarting Hermes.
- Configure Provider's LLM Provider field explains each option, and its API Key and Base URL fields say what to enter.
- Login to StartOS's password field says the password is not stored.
- Error messages from Configure Provider, the OpenAI Codex login and Login to StartOS appear in your language.`,
    es_ES: `Hermes Agent actualizado a 2026.9.24 (upstream 0.21.5). Desde el paquete 2026.9.14, añade una puerta de enlace única, configuración de conectores, streaming estructurado del CLI, carga automática de habilidades, API de plugins y mejoras de Desktop, y correcciones de perfiles, cron, Kanban, base de datos y puerta de enlace. Los nuevos proveedores, plugins e integraciones siguen siendo opcionales.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24

- Establecer la contraseña del panel pide confirmación antes de reemplazar una contraseña existente e indica que se cierra la sesión de todos los que hayan iniciado sesión en el panel.
- Completar OAuth de OpenAI Codex pide confirmación antes de reiniciar Hermes.
- El campo Proveedor de LLM de Configurar proveedor explica cada opción, y sus campos Clave de API y URL base indican qué introducir.
- El campo de contraseña de Iniciar sesión en StartOS indica que la contraseña no se almacena.
- Los mensajes de error de Configurar proveedor, del inicio de sesión de OpenAI Codex y de Iniciar sesión en StartOS aparecen en su idioma.`,
    de_DE: `Hermes Agent auf 2026.9.24 (Upstream 0.21.5) aktualisiert. Seit dem Paket 2026.9.14 gibt es einen einzelnen Gateway-Prozess, Connector-Einrichtung, strukturiertes CLI-Streaming, automatisches Laden von Skills, Desktop-Plugin-APIs und Oberflächenverbesserungen sowie Korrekturen für Profile, Cron, Kanban, Datenbank und Gateway. Neue Anbieter, Plugins und Integrationen bleiben optional.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24

- Dashboard-Passwort festlegen fragt vor dem Ersetzen eines vorhandenen Passworts nach einer Bestätigung und weist darauf hin, dass alle am Dashboard Angemeldeten abgemeldet werden.
- OpenAI Codex OAuth abschließen fragt vor dem Neustart von Hermes nach einer Bestätigung.
- Das Feld LLM-Anbieter in Anbieter konfigurieren erklärt jede Option, und die Felder API-Schlüssel und Basis-URL sagen, was einzugeben ist.
- Das Passwortfeld von Bei StartOS anmelden weist darauf hin, dass das Passwort nicht gespeichert wird.
- Fehlermeldungen von Anbieter konfigurieren, der OpenAI-Codex-Anmeldung und Bei StartOS anmelden erscheinen in Ihrer Sprache.`,
    pl_PL: `Hermes Agent zaktualizowano do 2026.9.24 (upstream 0.21.5). Od pakietu 2026.9.14 dodano pojedynczą bramę, konfigurację łączników, strumieniowanie strukturalne CLI, automatyczne ładowanie umiejętności, API wtyczek Desktop i ulepszenia interfejsu oraz poprawki profili, cron, Kanban, bazy danych i bramy. Nowi dostawcy, wtyczki i integracje pozostają opcjonalne.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24

- Ustaw hasło panelu prosi o potwierdzenie przed zastąpieniem istniejącego hasła i informuje, że wszyscy zalogowani do panelu zostaną wylogowani.
- Zakończ OAuth OpenAI Codex prosi o potwierdzenie przed ponownym uruchomieniem Hermesa.
- Pole Dostawca LLM w Konfiguruj dostawcę objaśnia każdą opcję, a pola Klucz API i Bazowy adres URL mówią, co wpisać.
- Pole hasła w Zaloguj się do StartOS informuje, że hasło nie jest przechowywane.
- Komunikaty o błędach z Konfiguruj dostawcę, logowania OpenAI Codex i Zaloguj się do StartOS pojawiają się w Twoim języku.`,
    fr_FR: `Hermes Agent mis à jour vers 2026.9.24 (amont 0.21.5). Depuis le paquet 2026.9.14, il ajoute une passerelle unique, la configuration des connecteurs, le streaming CLI structuré, le chargement automatique des compétences, les API de plugins et améliorations Desktop, et des correctifs pour les profils, cron, Kanban, la base de données et la passerelle. Les nouveaux fournisseurs, plugins et intégrations restent facultatifs.

https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24

- Définir le mot de passe du tableau de bord demande une confirmation avant de remplacer un mot de passe existant, et indique que toutes les personnes connectées au tableau de bord sont déconnectées.
- Terminer l'OAuth OpenAI Codex demande une confirmation avant de redémarrer Hermes.
- Le champ Fournisseur LLM de Configurer le fournisseur explique chaque option, et ses champs Clé d'API et URL de base indiquent quoi saisir.
- Le champ de mot de passe de Se connecter à StartOS indique que le mot de passe n'est pas stocké.
- Les messages d'erreur de Configurer le fournisseur, de la connexion OpenAI Codex et de Se connecter à StartOS s'affichent dans votre langue.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
