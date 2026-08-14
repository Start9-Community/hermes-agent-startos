import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.13:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.8.13, the upstream 0.20.1 patch release rolling up broad stabilization and fixes across the desktop app, gateway platforms, installers, tool system, and provider catalogs.

The package continues to use start-sdk 2.0 and includes start-cli 1.1.0 with signing-key authentication.

Release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.13`,
    es_ES: `Actualiza Hermes Agent a 2026.8.13, la versión de parche 0.20.1 de upstream que recopila amplias mejoras de estabilidad y correcciones en la aplicación de escritorio, las plataformas de gateway, los instaladores, el sistema de herramientas y los catálogos de proveedores.

El paquete continúa usando start-sdk 2.0 e incluye start-cli 1.1.0 con autenticación mediante clave de firma.

Versión: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.13`,
    de_DE: `Aktualisiert Hermes Agent auf 2026.8.13, die Upstream-Patch-Version 0.20.1 mit umfangreichen Stabilitätsverbesserungen und Fehlerbehebungen für die Desktop-App, Gateway-Plattformen, Installationsprogramme, das Werkzeugsystem und die Anbieter-Kataloge.

Das Paket verwendet weiterhin start-sdk 2.0 und enthält start-cli 1.1.0 mit Signaturschlüssel-Authentifizierung.

Veröffentlichung: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.13`,
    pl_PL: `Aktualizuje Hermes Agent do wersji 2026.8.13, poprawkowego wydania upstream 0.20.1 obejmującego szerokie usprawnienia stabilności i poprawki aplikacji desktopowej, platform bramy, instalatorów, systemu narzędzi oraz katalogów dostawców.

Pakiet nadal używa start-sdk 2.0 i zawiera start-cli 1.1.0 z uwierzytelnianiem za pomocą klucza podpisującego.

Wydanie: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.13`,
    fr_FR: `Met à jour Hermes Agent vers la version 2026.8.13, la version corrective amont 0.20.1 qui regroupe de nombreuses améliorations de stabilité et corrections pour l'application de bureau, les plateformes de passerelle, les programmes d'installation, le système d'outils et les catalogues de fournisseurs.

Le paquet continue d'utiliser start-sdk 2.0 et inclut start-cli 1.1.0 avec authentification par clé de signature.

Version : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.13`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
