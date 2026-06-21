import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.6.19:0',
  releaseNotes: {
    en_US:
      'Update Hermes Agent to upstream v2026.6.19 (v0.17.0, The Reach Release). Adds the latest upstream dashboard, gateway, model, memory, automation, and messaging improvements while preserving the StartOS provider configuration, managed skills, and first-boot permission fixes.',
    es_ES:
      'Actualiza Hermes Agent al upstream v2026.6.19 (v0.17.0, The Reach Release). Agrega las ultimas mejoras upstream de panel, gateway, modelos, memoria, automatizacion y mensajeria, manteniendo la configuracion de proveedores de StartOS, las habilidades gestionadas y las correcciones de permisos del primer arranque.',
    de_DE:
      'Aktualisiert Hermes Agent auf Upstream v2026.6.19 (v0.17.0, The Reach Release). Bringt die neuesten Upstream-Verbesserungen fuer Dashboard, Gateway, Modelle, Speicher, Automatisierung und Messaging, waehrend StartOS-Provider-Konfiguration, verwaltete Skills und Erststart-Berechtigungsfixes erhalten bleiben.',
    pl_PL:
      'Aktualizuje Hermes Agent do upstream v2026.6.19 (v0.17.0, The Reach Release). Dodaje najnowsze upstreamowe usprawnienia panelu, bramy, modeli, pamieci, automatyzacji i komunikatorow, zachowujac konfiguracje dostawcow StartOS, zarzadzane umiejetnosci i poprawki uprawnien pierwszego uruchomienia.',
    fr_FR:
      'Met a jour Hermes Agent vers upstream v2026.6.19 (v0.17.0, The Reach Release). Ajoute les dernieres ameliorations upstream du tableau de bord, de la passerelle, des modeles, de la memoire, de l automatisation et de la messagerie, tout en conservant la configuration des fournisseurs StartOS, les competences gerees et les corrections de permissions au premier demarrage.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
