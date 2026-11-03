import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.10.23:1',
  releaseNotes: {
    en_US:
      'Fixes the llama.cpp provider, whose requests failed with an authentication error on StartOS 0.4.1. Update llama.cpp first, then run Configure Provider again with llama.cpp selected.',
    es_ES:
      'Corrige el proveedor llama.cpp, cuyas solicitudes fallaban con un error de autenticación en StartOS 0.4.1. Actualice primero llama.cpp y luego vuelva a ejecutar Configurar proveedor con llama.cpp seleccionado.',
    de_DE:
      'Behebt den Anbieter llama.cpp, dessen Anfragen unter StartOS 0.4.1 mit einem Authentifizierungsfehler scheiterten. Aktualisieren Sie zuerst llama.cpp und führen Sie dann „Anbieter konfigurieren“ mit ausgewähltem llama.cpp erneut aus.',
    pl_PL:
      'Naprawia dostawcę llama.cpp, którego żądania kończyły się błędem uwierzytelniania w StartOS 0.4.1. Najpierw zaktualizuj llama.cpp, a następnie ponownie uruchom akcję „Konfiguruj dostawcę” z wybranym llama.cpp.',
    fr_FR:
      'Corrige le fournisseur llama.cpp, dont les requêtes échouaient avec une erreur d’authentification sous StartOS 0.4.1. Mettez d’abord llama.cpp à jour, puis relancez « Configurer le fournisseur » avec llama.cpp sélectionné.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
