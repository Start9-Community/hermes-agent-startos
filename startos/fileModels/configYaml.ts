import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Hermes' own config file: <data>/config.yaml.
 *
 * Hermes (and its dashboard) is the source of truth — the user edits most of
 * this through the dashboard. We only touch a few keys (skills wiring, provider
 * routing, and — in the future — mcp_servers). Every level we model is a
 * `looseObject` so keys we don't model survive a merge() instead of being
 * stripped by the schema parse, preserving 2-way binding with the dashboard.
 *
 * The `model` block is Hermes' provider routing (see cli-config.yaml.example
 * upstream). `provider` selects the backend ('custom' for any OpenAI-compatible
 * endpoint; 'ollama'/'vllm' are aliases for 'custom'; 'gemini' and
 * 'openai-codex' are named);
 * `base_url`/`api_key` are read from here for custom + the local aliases (the
 * .env OPENAI_BASE_URL path is no longer consulted upstream). Configure Provider
 * owns these four keys; the user's other model.* keys (context_length, …) survive.
 */
const shape = z.looseObject({
  model: z
    .looseObject({
      default: z.string().optional(),
      provider: z.string().optional(),
      base_url: z.string().optional(),
      api_key: z.string().optional(),
    })
    .optional(),
  skills: z
    .looseObject({
      external_dirs: z.array(z.string()).catch([]),
    })
    .optional(),
  plugins: z
    .looseObject({
      enabled: z.array(z.string()).catch([]),
      disabled: z.array(z.string()).catch([]),
    })
    .optional(),
  // Remote MCP servers. Empty until the StartOS MCP server ships; then the
  // Grant Access action writes an entry here pointing at https://<osIp>/mcp/v1.
  mcp_servers: z.looseObject({}).optional(),
})

export const configYaml = FileHelper.yaml(
  { base: sdk.volumes.main, subpath: 'config.yaml' },
  shape,
)
