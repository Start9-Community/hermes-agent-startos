import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.7.30:0',
  releaseNotes: {
    en_US: `Updated Hermes Agent to 2026.7.30, the upstream 0.19.1 patch release containing gateway, MCP, provider, voice, desktop, installer, and media-delivery fixes since 2026.7.20.

The package continues to use start-sdk 2.0 and includes start-cli 1.1.0 with signing-key authentication.

Release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.30`,
    es_ES: `Actualiza Hermes Agent a 2026.7.30, la versión de parche 0.19.1 de upstream que incluye correcciones de la pasarela, MCP, proveedores, voz, escritorio, instalador y entrega de archivos multimedia desde 2026.7.20.

El paquete continúa usando start-sdk 2.0 e incluye start-cli 1.1.0 con autenticación mediante clave de firma.

Versión: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.30`,
    de_DE: `Aktualisiert Hermes Agent auf 2026.7.30, die Upstream-Patchversion 0.19.1 mit Korrekturen für Gateway, MCP, Anbieter, Sprache, Desktop, Installer und Medienzustellung seit 2026.7.20.

Das Paket verwendet weiterhin start-sdk 2.0 und enthält start-cli 1.1.0 mit Signaturschlüssel-Authentifizierung.

Veröffentlichung: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.30`,
    pl_PL: `Aktualizuje Hermes Agent do 2026.7.30, poprawkowego wydania upstream 0.19.1, zawierającego poprawki bramy, MCP, dostawców, obsługi głosu, aplikacji desktopowej, instalatora i dostarczania multimediów od wersji 2026.7.20.

Pakiet nadal używa start-sdk 2.0 i zawiera start-cli 1.1.0 z uwierzytelnianiem za pomocą klucza podpisującego.

Wydanie: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.30`,
    fr_FR: `Met à jour Hermes Agent vers 2026.7.30, la version corrective 0.19.1 en amont qui regroupe des correctifs pour la passerelle, MCP, les fournisseurs, la voix, l'application de bureau, le programme d'installation et la livraison de médias depuis 2026.7.20.

Le paquet continue d'utiliser start-sdk 2.0 et inclut start-cli 1.1.0 avec authentification par clé de signature.

Version : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.30`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
