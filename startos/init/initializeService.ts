import { mkdir } from 'fs/promises'
import { configYaml } from '../fileModels/configYaml'
import { startCliConfigYaml } from '../fileModels/startCliConfig.yaml'
import { sdk } from '../sdk'
import { baselineBundlePath, bundlePath, mainMounts, skillsDir } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  // Seed start-cli's host from the OS IP (auth login fills in the rest).
  const osIp = await sdk.getOsIp(effects)
  await mkdir(sdk.volumes.main.subpath('.startos'), { recursive: true })
  await mkdir(sdk.volumes.main.subpath('.startos/knowledge'), {
    recursive: true,
  })
  await startCliConfigYaml.merge(effects, { host: `https://${osIp}` })

  // Wire the image-owned managed skills into Hermes' config on every install/upgrade.
  // (the loose merge preserves any skills the user/dashboard added elsewhere.)
  await configYaml.merge(effects, {
    skills: { external_dirs: [skillsDir] },
  })

  // Seed the support knowledge bundle from the image baseline if the live copy
  // (on the volume, refreshed in the background) doesn't exist yet.
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'hermes-agent' },
    mainMounts(),
    'seed-bundle',
    async (subc) => {
      await subc.exec(
        [
          'sh',
          '-c',
          `test -f ${bundlePath} || cp ${baselineBundlePath} ${bundlePath}`,
        ],
        { user: 'root' },
      )
    },
  )
})
