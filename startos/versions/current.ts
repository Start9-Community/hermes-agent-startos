import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.10.23:0',
  releaseNotes: {
    en_US:
      'Updated Hermes Agent to 0.22.5, which fixes three vulnerabilities in image decoding (CVE-2026-112900, CVE-2026-112393, CVE-2026-112403). Requires StartOS 0.4.0.3 or later.',
    es_ES:
      'Hermes Agent actualizado a 0.22.5, que corrige tres vulnerabilidades en la decodificación de imágenes (CVE-2026-112900, CVE-2026-112393, CVE-2026-112403). Requiere StartOS 0.4.0.3 o posterior.',
    de_DE:
      'Hermes Agent auf 0.22.5 aktualisiert, das drei Sicherheitslücken bei der Bilddekodierung behebt (CVE-2026-112900, CVE-2026-112393, CVE-2026-112403). Erfordert StartOS 0.4.0.3 oder neuer.',
    pl_PL:
      'Zaktualizowano Hermes Agent do wersji 0.22.5, która naprawia trzy podatności w dekodowaniu obrazów (CVE-2026-112900, CVE-2026-112393, CVE-2026-112403). Wymaga StartOS 0.4.0.3 lub nowszego.',
    fr_FR:
      "Mise à jour de Hermes Agent vers 0.22.5, qui corrige trois vulnérabilités dans le décodage d'images (CVE-2026-112900, CVE-2026-112393, CVE-2026-112403). Nécessite StartOS 0.4.0.3 ou une version ultérieure.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
