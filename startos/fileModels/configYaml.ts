import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Hermes' own config file: <data>/config.yaml.
 *
 * Hermes (and its dashboard) is the source of truth — the user edits most of
 * this through the dashboard. We only touch a few keys (skills wiring, provider
 * routing, dashboard auth, and — in the future — mcp_servers). The SDK's `z`
 * makes every object loose, so keys we don't model survive a merge() instead of
 * being stripped by the schema parse, preserving 2-way binding with the dashboard.
 *
 * The `model` block is Hermes' provider routing (see cli-config.yaml.example
 * upstream). `provider` selects the backend ('custom' for any OpenAI-compatible
 * endpoint; 'ollama'/'vllm' are aliases for 'custom'; 'gemini' and
 * 'openai-codex' are named);
 * `base_url`/`api_key` are read from here for custom + the local aliases (the
 * .env OPENAI_BASE_URL path is no longer consulted upstream). Configure Provider
 * owns these four keys; the user's other model.* keys (context_length, …) survive.
 *
 * The `dashboard.basic_auth` block registers Hermes' own BasicAuthProvider, which
 * is what permits the dashboard to bind the LXC bridge: the auth gate fails closed
 * on a non-loopback bind with no provider registered. `password_hash` is the only
 * credential surface we write — Hermes also accepts a plaintext `password` key,
 * which we never use. This block doubles as the "is a password set?" signal that
 * `init/watchCredentials.ts` reads. `secret` is the session token-signing key,
 * seeded once in init (see initializeService.ts).
 */
const shape = z.object({
  model: z
    .object({
      default: z.string().optional(),
      provider: z.string().optional(),
      base_url: z.string().optional(),
      api_key: z.string().optional(),
    })
    .optional(),
  dashboard: z
    .object({
      basic_auth: z
        .object({
          username: z.string().optional(),
          password_hash: z.string().optional(),
          secret: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  skills: z
    .object({
      external_dirs: z.array(z.string()).catch([]),
    })
    .optional(),
  plugins: z
    .object({
      enabled: z.array(z.string()).catch([]),
      disabled: z.array(z.string()).catch([]),
    })
    .optional(),
  // Remote MCP servers. Empty until the StartOS MCP server ships; then the
  // Grant Access action writes an entry here pointing at https://<osIp>/mcp/v1.
  mcp_servers: z.object({}).optional(),
})

export const configYaml = FileHelper.yaml(
  { base: sdk.volumes.main, subpath: 'config.yaml' },
  shape,
)
