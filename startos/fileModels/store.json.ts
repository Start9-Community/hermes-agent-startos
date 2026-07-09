import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Package-owned state (not Hermes config): the last Configure Provider
 * selection (for form pre-fill) and any pending OpenAI Codex device-code login.
 * The active backend is NOT tracked here — dependencies.ts derives it reactively
 * from config.yaml `model.provider`, so it follows the live config (including
 * dashboard edits) rather than only this action's selection.
 *
 * The dashboard password is not here either: only its scrypt hash is persisted,
 * in config.yaml, and Set Dashboard Password returns the plaintext once.
 */
const shape = z.object({
  // Last Configure Provider selection id, so the action can pre-fill its form.
  provider: z.string().optional(),
  codexOAuth: z
    .object({
      userCode: z.string(),
      deviceAuthId: z.string(),
      pollIntervalSeconds: z.number(),
      expiresAt: z.string(),
      model: z.string(),
    })
    .optional(),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.startos/store.json' },
  shape,
)
