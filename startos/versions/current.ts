import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.10.12:1',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 0.21.7. Dashboard readiness probes run inside the daemon container, avoiding newer SDK address fields absent from older hosts. Signed reasoning survives resumed sessions, source installations follow stable releases, and updater authorization errors are clearer. Includes the 0.21.6 security fixes and the StartOS startup/health fixes below. New providers and integrations remain optional.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.7

- Fixed the Messaging Gateway health check reporting that the gateway was stopped while it was running.
- Set Dashboard Password asks for confirmation before replacing an existing password, and says that everyone signed in to the dashboard is signed out.
- Complete OpenAI Codex OAuth asks for confirmation before restarting Hermes.
- Configure Provider's LLM Provider field explains each option, and its API Key and Base URL fields say what to enter.
- Login to StartOS's password field says the password is not stored.
- Error messages from Configure Provider, the OpenAI Codex login and Login to StartOS appear in your language.
- Restarting Hermes Agent while it is still starting stops every process of the previous run.`,
    es_ES: `Hermes Agent actualizado a 0.21.7. Se conserva el razonamiento firmado al reanudar sesiones y se mejoran las actualizaciones estables. Incluye las correcciones de seguridad de 0.21.6 y las correcciones de inicio y estado de StartOS que siguen. Los nuevos proveedores e integraciones son opcionales.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.7

- Corregida la comprobación de estado de la pasarela de mensajería, que indicaba que estaba detenida mientras seguía funcionando.
- Establecer la contraseña del panel pide confirmación antes de reemplazar una contraseña existente e indica que se cierra la sesión de todos los que hayan iniciado sesión en el panel.
- Completar OAuth de OpenAI Codex pide confirmación antes de reiniciar Hermes.
- El campo Proveedor de LLM de Configurar proveedor explica cada opción, y sus campos Clave de API y URL base indican qué introducir.
- El campo de contraseña de Iniciar sesión en StartOS indica que la contraseña no se almacena.
- Los mensajes de error de Configurar proveedor, del inicio de sesión de OpenAI Codex y de Iniciar sesión en StartOS aparecen en su idioma.
- Reiniciar Hermes Agent mientras aún se está iniciando detiene todos los procesos de la ejecución anterior.`,
    de_DE: `Hermes Agent auf 0.21.7 aktualisiert. Signiertes Reasoning bleibt beim Fortsetzen erhalten; stabile Updates werden verbessert. Enthält die Sicherheitskorrekturen aus 0.21.6 und die folgenden StartOS-Start- und Gesundheitskorrekturen. Neue Anbieter und Integrationen bleiben optional.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.7

- Die Integritätsprüfung des Messaging-Gateways meldet das Gateway nicht mehr als gestoppt, während es läuft.
- Dashboard-Passwort festlegen fragt vor dem Ersetzen eines vorhandenen Passworts nach einer Bestätigung und weist darauf hin, dass alle am Dashboard Angemeldeten abgemeldet werden.
- OpenAI Codex OAuth abschließen fragt vor dem Neustart von Hermes nach einer Bestätigung.
- Das Feld LLM-Anbieter in Anbieter konfigurieren erklärt jede Option, und die Felder API-Schlüssel und Basis-URL sagen, was einzugeben ist.
- Das Passwortfeld von Bei StartOS anmelden weist darauf hin, dass das Passwort nicht gespeichert wird.
- Fehlermeldungen von Anbieter konfigurieren, der OpenAI-Codex-Anmeldung und Bei StartOS anmelden erscheinen in Ihrer Sprache.
- Ein Neustart von Hermes Agent, während es noch startet, beendet alle Prozesse des vorherigen Laufs.`,
    pl_PL: `Hermes Agent zaktualizowano do 0.21.7. Podpisane rozumowanie jest zachowane przy wznowieniu; ulepszono stabilne aktualizacje. Zawiera poprawki bezpieczeństwa 0.21.6 oraz poniższe poprawki uruchamiania i stanu StartOS. Nowi dostawcy i integracje pozostają opcjonalni.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.7

- Naprawiono kontrolę stanu bramki komunikacyjnej, która zgłaszała zatrzymanie działającej bramki.
- Ustaw hasło panelu prosi o potwierdzenie przed zastąpieniem istniejącego hasła i informuje, że wszyscy zalogowani do panelu zostaną wylogowani.
- Zakończ OAuth OpenAI Codex prosi o potwierdzenie przed ponownym uruchomieniem Hermesa.
- Pole Dostawca LLM w Konfiguruj dostawcę objaśnia każdą opcję, a pola Klucz API i Bazowy adres URL mówią, co wpisać.
- Pole hasła w Zaloguj się do StartOS informuje, że hasło nie jest przechowywane.
- Komunikaty o błędach z Konfiguruj dostawcę, logowania OpenAI Codex i Zaloguj się do StartOS pojawiają się w Twoim języku.
- Ponowne uruchomienie Hermes Agent w trakcie uruchamiania zatrzymuje wszystkie procesy poprzedniego uruchomienia.`,
    fr_FR: `Hermes Agent mis à jour vers 0.21.7. Le raisonnement signé est conservé à la reprise et les mises à jour stables sont améliorées. Inclut les correctifs de sécurité de 0.21.6 et les correctifs StartOS de démarrage et d'état ci-dessous. Les nouveaux fournisseurs et intégrations restent facultatifs.

https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.7

- Correction du contrôle d'état de la passerelle de messagerie, qui l'indiquait arrêtée alors qu'elle fonctionnait.
- Définir le mot de passe du tableau de bord demande une confirmation avant de remplacer un mot de passe existant, et indique que toutes les personnes connectées au tableau de bord sont déconnectées.
- Terminer l'OAuth OpenAI Codex demande une confirmation avant de redémarrer Hermes.
- Le champ Fournisseur LLM de Configurer le fournisseur explique chaque option, et ses champs Clé d'API et URL de base indiquent quoi saisir.
- Le champ de mot de passe de Se connecter à StartOS indique que le mot de passe n'est pas stocké.
- Les messages d'erreur de Configurer le fournisseur, de la connexion OpenAI Codex et de Se connecter à StartOS s'affichent dans votre langue.
- Redémarrer Hermes Agent pendant son démarrage arrête tous les processus de l'exécution précédente.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
