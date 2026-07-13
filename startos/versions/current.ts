import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.7.7.2:0',
  releaseNotes: {
    en_US: `Updated Hermes to 2026.7.7.2 (upstream Hermes Agent v0.18.2).

Upstream describes this as an infrastructure-driven patch tag rather than a curated release: it rolls up roughly 667 commits merged since 2026.7.1 — dashboard and gateway fixes, MCP and provider fixes, WhatsApp dashboard pairing, and a large volume of stability work — and adds a same-day patch that installs the WhatsApp bridge dependency from a published release so image builds are reliable. Upstream plans to publish full, curated notes for this window with v0.19.0.

Release: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7.2`,
    es_ES: `Se actualizó Hermes a 2026.7.7.2 (Hermes Agent v0.18.2 upstream).

Upstream describe esta versión como una etiqueta de parche impulsada por la infraestructura, más que como una versión curada: agrupa alrededor de 667 commits fusionados desde 2026.7.1 —correcciones del panel y de la pasarela, correcciones de MCP y de proveedores, emparejamiento de WhatsApp con el panel y un gran volumen de trabajo de estabilidad— y añade un parche del mismo día que instala la dependencia del puente de WhatsApp desde una versión publicada, lo que hace fiables las compilaciones de la imagen. Upstream tiene previsto publicar notas completas y curadas de este periodo con la versión v0.19.0.

Versión: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7.2`,
    de_DE: `Hermes wurde auf 2026.7.7.2 aktualisiert (Upstream Hermes Agent v0.18.2).

Upstream bezeichnet dies als einen infrastrukturgetriebenen Patch-Tag und nicht als kuratierte Veröffentlichung: Er fasst rund 667 seit 2026.7.1 zusammengeführte Commits zusammen — Korrekturen an Dashboard und Gateway, Korrekturen an MCP und Anbietern, WhatsApp-Dashboard-Kopplung sowie eine große Menge an Stabilitätsarbeit — und ergänzt einen Patch vom selben Tag, der die WhatsApp-Bridge-Abhängigkeit aus einer veröffentlichten Version installiert, damit Image-Builds zuverlässig sind. Upstream will vollständige, kuratierte Versionshinweise für diesen Zeitraum mit v0.19.0 veröffentlichen.

Veröffentlichung: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7.2`,
    pl_PL: `Zaktualizowano Hermes do wersji 2026.7.7.2 (Hermes Agent v0.18.2 w upstream).

Upstream opisuje to wydanie jako tag poprawkowy podyktowany infrastrukturą, a nie starannie opracowane wydanie: zbiera on około 667 commitów scalonych od wersji 2026.7.1 — poprawki panelu i bramy, poprawki MCP oraz dostawców, parowanie WhatsApp z panelem i dużą liczbę prac nad stabilnością — oraz dodaje wydaną tego samego dnia poprawkę, która instaluje zależność mostka WhatsApp z opublikowanego wydania, dzięki czemu budowanie obrazu jest niezawodne. Upstream planuje opublikować pełne, opracowane informacje o tym okresie wraz z wersją v0.19.0.

Wydanie: https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7.2`,
    fr_FR: `Hermes a été mis à jour vers 2026.7.7.2 (Hermes Agent v0.18.2 en amont).

Le projet en amont décrit cette version comme une étiquette de correctif dictée par l'infrastructure plutôt que comme une version soigneusement préparée : elle regroupe environ 667 commits fusionnés depuis la version 2026.7.1 — corrections du tableau de bord et de la passerelle, corrections de MCP et des fournisseurs, appairage de WhatsApp avec le tableau de bord et un important travail de stabilisation — et ajoute un correctif publié le jour même qui installe la dépendance de la passerelle WhatsApp à partir d'une version publiée, ce qui fiabilise la construction de l'image. Le projet en amont prévoit de publier des notes complètes et soignées pour cette période avec la version v0.19.0.

Version : https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7.2`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
