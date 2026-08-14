import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.13:1',
  releaseNotes: {
    en_US: `Fixes slow service startup. The ownership repair that runs at boot walked the whole Hermes data directory — including any repositories and build caches the agent had created there — holding the dashboard and gateway offline for minutes on a well-used install. It now repairs only the paths StartOS itself writes.

Hermes Agent is unchanged at 2026.8.13 (upstream 0.20.1).`,
    es_ES: `Corrige el arranque lento del servicio. La reparación de propiedad que se ejecuta al inicio recorría todo el directorio de datos de Hermes —incluidos los repositorios y las cachés de compilación que el agente hubiera creado allí—, lo que dejaba el panel y la pasarela fuera de servicio durante minutos en una instalación con mucho uso. Ahora solo repara las rutas que escribe StartOS.

Hermes Agent se mantiene en 2026.8.13 (upstream 0.20.1).`,
    de_DE: `Behebt den langsamen Dienststart. Die Eigentümer-Reparatur beim Start durchlief das gesamte Hermes-Datenverzeichnis — einschließlich aller dort vom Agenten angelegten Repositorys und Build-Caches — und hielt Dashboard und Gateway auf einer viel genutzten Installation minutenlang offline. Sie repariert jetzt nur noch die Pfade, die StartOS selbst schreibt.

Hermes Agent bleibt unverändert bei 2026.8.13 (Upstream 0.20.1).`,
    pl_PL: `Naprawia powolne uruchamianie usługi. Naprawa właściciela plików wykonywana przy starcie przechodziła przez cały katalog danych Hermesa — łącznie z repozytoriami i pamięciami podręcznymi kompilacji utworzonymi tam przez agenta — przez co panel i brama pozostawały niedostępne przez wiele minut na intensywnie używanej instalacji. Teraz naprawiane są tylko ścieżki zapisywane przez StartOS.

Hermes Agent pozostaje w wersji 2026.8.13 (upstream 0.20.1).`,
    fr_FR: `Corrige la lenteur au démarrage du service. La réparation des propriétaires effectuée au démarrage parcourait l'intégralité du répertoire de données de Hermes — y compris les dépôts et les caches de compilation que l'agent y avait créés —, laissant le tableau de bord et la passerelle hors service pendant plusieurs minutes sur une installation très utilisée. Elle ne répare désormais que les chemins écrits par StartOS.

Hermes Agent reste en 2026.8.13 (amont 0.20.1).`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
