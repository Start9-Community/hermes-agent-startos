import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// start-cli config: <data>/.startos/config.yaml. Only the host is set by us
// (seeded from the OS IP at init); start-cli auth login stores its identity key
// alongside this file.
const shape = z.object({
  host: z.string().optional(),
})

export const startCliConfigYaml = FileHelper.yaml(
  { base: sdk.volumes.main, subpath: '.startos/config.yaml' },
  shape,
)
