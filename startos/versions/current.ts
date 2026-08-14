import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.8.13:2',
  releaseNotes: {
    en_US: `Fixes two service-lifecycle problems.

Startup no longer stalls: the ownership repair that runs at boot walked the whole Hermes data directory — including any repositories and build caches the agent had created there — holding the dashboard and gateway offline for minutes on a well-used install. It now repairs only the paths StartOS itself writes.

Long-running sessions no longer leave processes behind: subprocesses orphaned when a goal or tool session ends are now cleaned up instead of accumulating for the life of the container.

Hermes Agent is unchanged at 2026.8.13 (upstream 0.20.1).`,
    es_ES: `Corrige dos problemas del ciclo de vida del servicio.

El arranque ya no se atasca: la reparación de propiedad que se ejecuta al inicio recorría todo el directorio de datos de Hermes —incluidos los repositorios y las cachés de compilación que el agente hubiera creado allí—, lo que dejaba el panel y la pasarela fuera de servicio durante minutos en una instalación con mucho uso. Ahora solo repara las rutas que escribe StartOS.

Las sesiones prolongadas ya no dejan procesos atrás: los subprocesos que quedan huérfanos al terminar una sesión de objetivo o de herramienta ahora se limpian en lugar de acumularse durante toda la vida del contenedor.

Hermes Agent se mantiene en 2026.8.13 (upstream 0.20.1).`,
    de_DE: `Behebt zwei Probleme im Dienstlebenszyklus.

Der Start hängt nicht mehr: Die Eigentümer-Reparatur beim Start durchlief das gesamte Hermes-Datenverzeichnis — einschließlich aller dort vom Agenten angelegten Repositorys und Build-Caches — und hielt Dashboard und Gateway auf einer viel genutzten Installation minutenlang offline. Sie repariert jetzt nur noch die Pfade, die StartOS selbst schreibt.

Lang laufende Sitzungen lassen keine Prozesse mehr zurück: Unterprozesse, die beim Ende einer Ziel- oder Werkzeugsitzung verwaisen, werden jetzt aufgeräumt, statt sich über die gesamte Laufzeit des Containers anzusammeln.

Hermes Agent bleibt unverändert bei 2026.8.13 (Upstream 0.20.1).`,
    pl_PL: `Naprawia dwa problemy cyklu życia usługi.

Uruchamianie już się nie zacina: naprawa właściciela plików wykonywana przy starcie przechodziła przez cały katalog danych Hermesa — łącznie z repozytoriami i pamięciami podręcznymi kompilacji utworzonymi tam przez agenta — przez co panel i brama pozostawały niedostępne przez wiele minut na intensywnie używanej instalacji. Teraz naprawiane są tylko ścieżki zapisywane przez StartOS.

Długo działające sesje nie pozostawiają już procesów: podprocesy osierocone po zakończeniu sesji celu lub narzędzia są teraz sprzątane, zamiast gromadzić się przez cały czas życia kontenera.

Hermes Agent pozostaje w wersji 2026.8.13 (upstream 0.20.1).`,
    fr_FR: `Corrige deux problèmes du cycle de vie du service.

Le démarrage ne bloque plus : la réparation des propriétaires effectuée au démarrage parcourait l'intégralité du répertoire de données de Hermes — y compris les dépôts et les caches de compilation que l'agent y avait créés —, laissant le tableau de bord et la passerelle hors service pendant plusieurs minutes sur une installation très utilisée. Elle ne répare désormais que les chemins écrits par StartOS.

Les sessions de longue durée ne laissent plus de processus derrière elles : les sous-processus orphelins à la fin d'une session d'objectif ou d'outil sont maintenant nettoyés au lieu de s'accumuler pendant toute la durée de vie du conteneur.

Hermes Agent reste en 2026.8.13 (amont 0.20.1).`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
