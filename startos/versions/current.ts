import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.7.20:3',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.7.20, picking up upstream dashboard, gateway, provider, and stability fixes since 2026.7.7.2.

This release also migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later).

This revision fixes Login to StartOS on supported hosts by upgrading the bundled start-cli to 1.1.0 and its signing-key authentication.

Release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20`,
    es_ES: `Actualiza Hermes Agent a 2026.7.20, incorporando las correcciones del panel, la pasarela, los proveedores y la estabilidad publicadas en upstream desde la versión 2026.7.7.2.

Esta versión también migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior).

Esta revisión corrige Iniciar sesión en StartOS en los hosts compatibles al actualizar el start-cli incluido a la versión 1.1.0 y su autenticación mediante claves de firma.

Versión: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20`,
    de_DE: `Aktualisiert Hermes Agent auf 2026.7.20 und übernimmt die seit 2026.7.7.2 im Upstream veröffentlichten Korrekturen an Dashboard, Gateway, Anbietern und Stabilität.

Diese Version stellt das Paket außerdem auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer).

Diese Revision behebt die Anmeldung bei StartOS auf unterstützten Hosts, indem das enthaltene start-cli auf Version 1.1.0 und dessen Signaturschlüssel-Authentifizierung aktualisiert wird.

Veröffentlichung: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20`,
    pl_PL: `Aktualizuje Hermes Agent do 2026.7.20, przejmując opublikowane w upstream od wersji 2026.7.7.2 poprawki panelu, bramy, dostawców oraz stabilności.

Ta wersja przenosi też pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego).

Ta rewizja naprawia logowanie do StartOS na obsługiwanych hostach, aktualizując dołączony start-cli do wersji 1.1.0 i uwierzytelniania kluczem podpisującym.

Wydanie: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20`,
    fr_FR: `Met à jour Hermes Agent vers 2026.7.20, en intégrant les corrections du tableau de bord, de la passerelle, des fournisseurs et de la stabilité publiées en amont depuis la version 2026.7.7.2.

Cette version fait également passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure).

Cette révision corrige la connexion à StartOS sur les hôtes pris en charge en mettant à jour le start-cli intégré vers la version 1.1.0 et son authentification par clé de signature.

Version : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
