import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.10.8:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 0.21.6 (package version 2026.10.8, the upstream release date). It rolls up about 2,100 upstream changes since 0.21.5, including security fixes for dashboard sign-in, for git commands run on untrusted repositories, and for the email gateway's sender check. New providers, plugins and integrations remain optional and require their own setup.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6

- Set Dashboard Password asks for confirmation before replacing an existing password, and says that everyone signed in to the dashboard is signed out.
- Complete OpenAI Codex OAuth asks for confirmation before restarting Hermes.
- Configure Provider's LLM Provider field explains each option, and its API Key and Base URL fields say what to enter.
- Login to StartOS's password field says the password is not stored.
- Error messages from Configure Provider, the OpenAI Codex login and Login to StartOS appear in your language.`,
    es_ES: `Hermes Agent actualizado a 0.21.6 (versión del paquete 2026.10.8, la fecha de publicación upstream). Reúne unos 2100 cambios upstream desde 0.21.5, incluidas correcciones de seguridad en el inicio de sesión del panel, en los comandos git ejecutados sobre repositorios no fiables y en la comprobación del remitente de la pasarela de correo. Los nuevos proveedores, plugins e integraciones siguen siendo opcionales y requieren su propia configuración.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6

- Establecer la contraseña del panel pide confirmación antes de reemplazar una contraseña existente e indica que se cierra la sesión de todos los que hayan iniciado sesión en el panel.
- Completar OAuth de OpenAI Codex pide confirmación antes de reiniciar Hermes.
- El campo Proveedor de LLM de Configurar proveedor explica cada opción, y sus campos Clave de API y URL base indican qué introducir.
- El campo de contraseña de Iniciar sesión en StartOS indica que la contraseña no se almacena.
- Los mensajes de error de Configurar proveedor, del inicio de sesión de OpenAI Codex y de Iniciar sesión en StartOS aparecen en su idioma.`,
    de_DE: `Hermes Agent auf 0.21.6 aktualisiert (Paketversion 2026.10.8, das Upstream-Veröffentlichungsdatum). Enthält rund 2.100 Upstream-Änderungen seit 0.21.5, darunter Sicherheitskorrekturen für die Dashboard-Anmeldung, für Git-Befehle in nicht vertrauenswürdigen Repositorys und für die Absenderprüfung des E-Mail-Gateways. Neue Anbieter, Plugins und Integrationen bleiben optional und erfordern eine eigene Einrichtung.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6

- Dashboard-Passwort festlegen fragt vor dem Ersetzen eines vorhandenen Passworts nach einer Bestätigung und weist darauf hin, dass alle am Dashboard Angemeldeten abgemeldet werden.
- OpenAI Codex OAuth abschließen fragt vor dem Neustart von Hermes nach einer Bestätigung.
- Das Feld LLM-Anbieter in Anbieter konfigurieren erklärt jede Option, und die Felder API-Schlüssel und Basis-URL sagen, was einzugeben ist.
- Das Passwortfeld von Bei StartOS anmelden weist darauf hin, dass das Passwort nicht gespeichert wird.
- Fehlermeldungen von Anbieter konfigurieren, der OpenAI-Codex-Anmeldung und Bei StartOS anmelden erscheinen in Ihrer Sprache.`,
    pl_PL: `Hermes Agent zaktualizowano do 0.21.6 (wersja pakietu 2026.10.8, data wydania upstream). Obejmuje około 2100 zmian upstream od 0.21.5, w tym poprawki bezpieczeństwa logowania do panelu, poleceń git uruchamianych na niezaufanych repozytoriach oraz sprawdzania nadawcy w bramce e-mail. Nowi dostawcy, wtyczki i integracje pozostają opcjonalne i wymagają osobnej konfiguracji.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6

- Ustaw hasło panelu prosi o potwierdzenie przed zastąpieniem istniejącego hasła i informuje, że wszyscy zalogowani do panelu zostaną wylogowani.
- Zakończ OAuth OpenAI Codex prosi o potwierdzenie przed ponownym uruchomieniem Hermesa.
- Pole Dostawca LLM w Konfiguruj dostawcę objaśnia każdą opcję, a pola Klucz API i Bazowy adres URL mówią, co wpisać.
- Pole hasła w Zaloguj się do StartOS informuje, że hasło nie jest przechowywane.
- Komunikaty o błędach z Konfiguruj dostawcę, logowania OpenAI Codex i Zaloguj się do StartOS pojawiają się w Twoim języku.`,
    fr_FR: `Hermes Agent mis à jour vers 0.21.6 (version du paquet 2026.10.8, la date de publication en amont). Il regroupe environ 2 100 modifications en amont depuis 0.21.5, dont des correctifs de sécurité pour la connexion au tableau de bord, pour les commandes git exécutées sur des dépôts non fiables et pour la vérification de l'expéditeur de la passerelle e-mail. Les nouveaux fournisseurs, plugins et intégrations restent facultatifs et nécessitent leur propre configuration.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6

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
