import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { dataDir, mainMounts } from '../utils'

export const current = VersionInfo.of({
  version: '2026.10.8:2',
  releaseNotes: {
    en_US:
      'Fixed Hermes Agent failing to start after a `hermes` command, such as `hermes pm repair`, was run in a root shell from `start-cli package attach`. Updating repairs an affected install; `hermes` commands run as root now act as the hermes user.',
    es_ES:
      'Corregido el fallo de arranque de Hermes Agent tras ejecutar un comando `hermes`, como `hermes pm repair`, en un shell de root abierto con `start-cli package attach`. La actualización repara una instalación afectada; los comandos `hermes` ejecutados como root ahora actúan como el usuario hermes.',
    de_DE:
      'Behoben: Hermes Agent startete nicht mehr, nachdem ein `hermes`-Befehl wie `hermes pm repair` in einer Root-Shell aus `start-cli package attach` ausgeführt wurde. Das Update repariert eine betroffene Installation; als Root ausgeführte `hermes`-Befehle laufen jetzt als Benutzer hermes.',
    pl_PL:
      'Naprawiono błąd uruchamiania Hermes Agent po wykonaniu polecenia `hermes`, takiego jak `hermes pm repair`, w powłoce root otwartej przez `start-cli package attach`. Aktualizacja naprawia dotkniętą instalację; polecenia `hermes` uruchamiane jako root działają teraz jako użytkownik hermes.',
    fr_FR:
      "Correction de l'échec du démarrage de Hermes Agent après l'exécution d'une commande `hermes`, comme `hermes pm repair`, dans un shell root ouvert avec `start-cli package attach`. La mise à jour répare une installation touchée ; les commandes `hermes` lancées en root agissent désormais en tant qu'utilisateur hermes.",
  },
  migrations: {
    up: async ({ effects }) => {
      // A root-run `hermes` could write anywhere under the volume, which
      // the boot chown oneshot deliberately does not walk.
      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'hermes-agent' },
        mainMounts(),
        'root-owned-repair',
        (subc) =>
          subc.execFail(
            [
              'find',
              dataDir,
              '-xdev',
              '(',
              '-uid',
              '0',
              '-o',
              '-gid',
              '0',
              ')',
              '-exec',
              'chown',
              '-h',
              '1000:1000',
              '{}',
              '+',
            ],
            { user: 'root' },
          ),
      )
    },
    down: IMPOSSIBLE,
  },
})
