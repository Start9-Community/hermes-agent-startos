import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Hermes' <data>/auth.json — OAuth provider state owned by Hermes. The action
 * only writes the OpenAI Codex singleton token entry and active provider; loose
 * objects preserve rotated token metadata, credential pools, and other providers.
 */
const shape = z.looseObject({
  version: z.number().optional(),
  providers: z
    .looseObject({
      'openai-codex': z
        .looseObject({
          tokens: z
            .looseObject({
              access_token: z.string().optional(),
              refresh_token: z.string().optional(),
            })
            .optional(),
          last_refresh: z.string().optional(),
          auth_mode: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  active_provider: z.string().optional(),
})

export const authJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'auth.json' },
  shape,
)
