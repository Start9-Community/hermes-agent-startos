import { T } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { configYaml } from '../fileModels/configYaml'
import { envFile } from '../fileModels/envFile'
import { storeJson } from '../fileModels/store.json'
import { readDependencyApiKey } from '../publicCredentials'
import { i18n } from '../i18n'
import { completeCodexOAuth } from './completeCodexOAuth'
import { CODEX_DEVICE_URL, requestCodexDeviceCode } from './codexOAuth'

const { InputSpec, Value, Variants } = sdk

// xAI's API is OpenAI-compatible; routed as `custom` with this base URL.
const GROK_BASE_URL = 'https://api.x.ai/v1'

// Local-inference dependencies (ollama/vllm/llama-cpp) each export an
// OpenAI-compatible `api` interface on a MultiHost named `api-multi`. Resolve
// its plain-HTTP LXC-bridge base URL (e.g. `http://10.0.3.5:11434`) at apply
// time — the retired `<pkg>.startos` DNS no longer resolves between containers.
// String-literal ids because these are optional runtime deps, not npm
// `-startos` packages whose id constants we could import.
const DEP_API_HOST_ID = 'api-multi'
const DEP_API_INTERFACE_ID = 'api'

const depApiBaseUrl = (effects: T.Effects, packageId: string) =>
  sdk.host
    .get(effects, { hostId: DEP_API_HOST_ID, packageId }, (host) => {
      const iface =
        host &&
        Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === DEP_API_INTERFACE_ID)
      return iface
        ? iface.addressInfo
            .filter({ kind: 'bridge', predicate: (h) => !h.ssl })
            .format('urlstring')[0]
        : undefined
    })
    .once()

// Curated model catalogs per named cloud provider (exact API model ids → label).
// Configure Provider sets the *default* model; it can be changed anytime from
// within Hermes chat via the /model command.
const ANTHROPIC_MODELS = {
  'claude-opus-4-8': 'Claude Opus 4.8 — most capable',
  'claude-opus-4-7': 'Claude Opus 4.7',
  'claude-sonnet-4-6': 'Claude Sonnet 4.6 — balanced',
  'claude-haiku-4-5': 'Claude Haiku 4.5 — fast & cheap',
  'claude-fable-5': 'Claude Fable 5 — premium',
}
const GEMINI_MODELS = {
  'gemini-2.5-pro': 'Gemini 2.5 Pro',
  'gemini-3.5-flash': 'Gemini 3.5 Flash — newest, strong for agentic',
  'gemini-2.5-flash': 'Gemini 2.5 Flash — fast',
  'gemini-2.5-flash-lite': 'Gemini 2.5 Flash-Lite — cheapest',
}
const GROK_MODELS = {
  'grok-4.3': 'Grok 4.3 — flagship',
  'grok-build-0.1': 'Grok Build 0.1 — agentic coding',
  'grok-4.20-multi-agent-0309': 'Grok 4.20 Multi-Agent',
}
const CODEX_MODELS = {
  'gpt-5.5': 'GPT-5.5 — strongest',
  'gpt-5.4': 'GPT-5.4',
  'gpt-5.4-mini': 'GPT-5.4 Mini — fast/cheap',
}

// Named-provider model picker: a dropdown of known ids plus an optional Custom
// field, so a brand-new id can be entered without waiting for a package update.
// Spread into a variant's spec; `pickModel` resolves the chosen value.
const modelDropdown = <V extends Record<string, string>>(
  values: V,
  def: keyof V & string,
) => ({
  model: Value.select({
    name: i18n('Default Model'),
    description: i18n(
      'The model Hermes uses by default. Change it anytime from within Hermes chat with the /model command.',
    ),
    default: def,
    values,
  }),
  customModel: Value.text({
    name: i18n('Custom Model (optional)'),
    description: i18n(
      'Use an exact model id that is not in the list above. Leave blank to use the dropdown selection.',
    ),
    required: false,
    default: null,
    placeholder: def,
  }),
})

// Free-text model for backends whose served id the user determines (local
// Ollama/vLLM/llama.cpp, or an arbitrary OpenAI-compatible endpoint).
const servedModelField = (placeholder: string) =>
  Value.text({
    name: i18n('Default Model'),
    description: i18n(
      'The model Hermes uses by default. Change it anytime from within Hermes chat with the /model command.',
    ),
    required: true,
    default: null,
    placeholder,
  })

// Resolve the model from a dropdown+custom pair — a filled Custom field wins.
const pickModel = (v: { model: string; customModel?: string | null }) =>
  (v.customModel ?? '').trim() || v.model

// Prefill helper for a dropdown+custom pair: select a known id, else route an
// unknown (custom) id to the Custom field, leaving the dropdown at its default.
const prefillModel = <V extends Record<string, string>>(
  catalog: V,
  id: string | undefined,
): { model: keyof V & string } | { customModel: string } | {} =>
  id == null
    ? {}
    : id in catalog
      ? { model: id as keyof V & string }
      : { customModel: id }

const apiKeyField = (placeholder: string) =>
  Value.text({
    name: i18n('API Key'),
    description: i18n('API key for this provider'),
    required: true,
    default: null,
    masked: true,
    placeholder,
  })

const providerVariants = Variants.of({
  'openai-compatible': {
    name: i18n('OpenAI-Compatible'),
    spec: InputSpec.of({
      baseUrl: Value.text({
        name: i18n('Base URL'),
        description: i18n(
          'OpenAI-compatible API base URL, e.g. https://api.openai.com/v1',
        ),
        required: true,
        default: null,
        placeholder: 'https://api.openai.com/v1',
      }),
      apiKey: apiKeyField('sk-...'),
      model: servedModelField('gpt-4o'),
    }),
  },
  'openai-codex': {
    name: i18n('OpenAI Codex OAuth'),
    spec: InputSpec.of({ ...modelDropdown(CODEX_MODELS, 'gpt-5.5') }),
  },
  gemini: {
    name: i18n('Google Gemini'),
    spec: InputSpec.of({
      apiKey: apiKeyField('...'),
      ...modelDropdown(GEMINI_MODELS, 'gemini-2.5-pro'),
    }),
  },
  grok: {
    name: i18n('xAI Grok'),
    spec: InputSpec.of({
      apiKey: apiKeyField('xai-...'),
      ...modelDropdown(GROK_MODELS, 'grok-4.3'),
    }),
  },
  anthropic: {
    name: i18n('Anthropic Claude'),
    spec: InputSpec.of({
      apiKey: apiKeyField('sk-ant-...'),
      ...modelDropdown(ANTHROPIC_MODELS, 'claude-opus-4-8'),
    }),
  },
  ollama: {
    name: i18n('Ollama (local)'),
    spec: InputSpec.of({ model: servedModelField('llama3.1:8b') }),
  },
  vllm: {
    name: i18n('vLLM (local)'),
    spec: InputSpec.of({
      model: servedModelField('Qwen/Qwen2.5-7B-Instruct'),
    }),
  },
  'llama-cpp': {
    name: i18n('llama.cpp (local)'),
    spec: InputSpec.of({
      model: servedModelField('the model your server serves'),
    }),
  },
})

const inputSpec = InputSpec.of({
  provider: Value.union({
    name: i18n('LLM Provider'),
    description: i18n(
      'Choose the model backend. Ollama, vLLM and llama.cpp run locally on your server (added as a dependency); the rest are cloud providers requiring an API key or OAuth tokens.',
    ),
    default: 'ollama',
    variants: providerVariants,
  }),
})

export const configureProvider = sdk.Action.withInput(
  'configure-provider',

  async ({ effects }) => ({
    name: i18n('Configure Provider'),
    description: i18n(
      'Choose and configure the LLM backend Hermes uses (local Ollama/vLLM/llama.cpp, or a cloud/OAuth provider)',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill from the last selection. We never echo API keys back into the form.
  async ({ effects }) => {
    const sel = await storeJson
      .read((s) => s.provider)
      .once()
      .catch(() => undefined)
    if (!sel) return null
    const model = await configYaml
      .read((c) => c.model)
      .once()
      .catch(() => undefined)
    // Prefill non-secret fields only; the form's own `default: null` applies to
    // anything we omit (including every API key).
    const baseUrl = model?.base_url ?? undefined
    const modelId = model?.default ?? undefined
    switch (sel) {
      case 'openai-compatible':
        return {
          provider: {
            selection: 'openai-compatible' as const,
            value: { baseUrl, model: modelId },
          },
        }
      case 'openai-codex':
        return {
          provider: {
            selection: 'openai-codex' as const,
            value: prefillModel(CODEX_MODELS, modelId),
          },
        }
      case 'grok':
        return {
          provider: {
            selection: 'grok' as const,
            value: prefillModel(GROK_MODELS, modelId),
          },
        }
      case 'gemini':
        return {
          provider: {
            selection: 'gemini' as const,
            value: prefillModel(GEMINI_MODELS, modelId),
          },
        }
      case 'anthropic':
        return {
          provider: {
            selection: 'anthropic' as const,
            value: prefillModel(ANTHROPIC_MODELS, modelId),
          },
        }
      case 'ollama':
        return {
          provider: { selection: 'ollama' as const, value: { model: modelId } },
        }
      case 'vllm':
        return {
          provider: { selection: 'vllm' as const, value: { model: modelId } },
        }
      case 'llama-cpp':
        return {
          provider: {
            selection: 'llama-cpp' as const,
            value: { model: modelId },
          },
        }
      default:
        return null
    }
  },

  async ({ effects, input }) => {
    const p = input.provider

    // Routing keys this action owns on Hermes' config.yaml `model` block. We set
    // all four on every apply (undefined clears a stale value) so switching
    // providers never leaves a mismatched key behind. Hermes reads provider,
    // base_url and api_key from config.yaml — the .env OPENAI_BASE_URL path is no
    // longer consulted, and the config api_key is honoured for `custom` and the
    // `ollama`/`vllm` aliases. Gemini and Anthropic are named providers, keyed
    // from .env. OpenAI Codex OAuth is a named provider keyed from auth.json.
    let model: {
      provider: string
      base_url: string | undefined
      api_key: string | undefined
      default: string
    }
    const envPatch: Record<string, string | undefined> = {}
    let codexOAuth:
      Awaited<ReturnType<typeof requestCodexDeviceCode>> | undefined

    if (p.selection === 'ollama') {
      const baseUrl = await depApiBaseUrl(effects, 'ollama')
      if (!baseUrl) {
        throw new Error(
          'Ollama is not yet reachable on the internal network. Install and start Ollama, then run Configure Provider again.',
        )
      }
      model = {
        provider: 'ollama',
        base_url: `${baseUrl}/v1`,
        api_key: undefined,
        default: p.value.model,
      }
    } else if (p.selection === 'vllm') {
      const baseUrl = await depApiBaseUrl(effects, 'vllm')
      if (!baseUrl) {
        throw new Error(
          'vLLM is not yet reachable on the internal network. Install and start vLLM, then run Configure Provider again.',
        )
      }
      const key = await readDependencyApiKey(effects, 'vllm')
      if (!key) {
        throw new Error(
          'vLLM is selected but its API key could not be read from vllm:public/credentials.json. Make sure vLLM is installed, running, and at a version that publishes its public credentials (>=0.16.0:0.1).',
        )
      }
      model = {
        provider: 'vllm',
        base_url: `${baseUrl}/v1`,
        api_key: key,
        default: p.value.model,
      }
    } else if (p.selection === 'llama-cpp') {
      const baseUrl = await depApiBaseUrl(effects, 'llama-cpp')
      if (!baseUrl) {
        throw new Error(
          'llama.cpp is not yet reachable on the internal network. Install and start llama.cpp, then run Configure Provider again.',
        )
      }
      // llama.cpp runs keyless; its basic auth is enforced only at the OS
      // reverse-proxy edge, so internal bridge connections need none.
      model = {
        provider: 'llamacpp',
        base_url: `${baseUrl}/v1`,
        api_key: undefined,
        default: p.value.model,
      }
    } else if (p.selection === 'openai-compatible') {
      model = {
        provider: 'custom',
        base_url: p.value.baseUrl,
        api_key: p.value.apiKey,
        default: p.value.model,
      }
    } else if (p.selection === 'openai-codex') {
      codexOAuth = await requestCodexDeviceCode(pickModel(p.value))
      model = {
        provider: 'openai-codex',
        base_url: undefined,
        api_key: undefined,
        default: pickModel(p.value),
      }
    } else if (p.selection === 'grok') {
      model = {
        provider: 'custom',
        base_url: GROK_BASE_URL,
        api_key: p.value.apiKey,
        default: pickModel(p.value),
      }
    } else if (p.selection === 'gemini') {
      model = {
        provider: 'gemini',
        base_url: undefined,
        api_key: undefined,
        default: pickModel(p.value),
      }
      envPatch.GEMINI_API_KEY = p.value.apiKey
    } else if (p.selection === 'anthropic') {
      model = {
        provider: 'anthropic',
        base_url: undefined,
        api_key: undefined,
        default: pickModel(p.value),
      }
      envPatch.ANTHROPIC_API_KEY = p.value.apiKey
    } else {
      throw new Error('Unknown provider selection')
    }

    await configYaml.merge(effects, { model })
    if (Object.keys(envPatch).length > 0) await envFile.merge(effects, envPatch)
    await storeJson.merge(effects, {
      provider: p.selection,
      codexOAuth,
    })
    if (codexOAuth) {
      await sdk.action.createOwnTask(effects, completeCodexOAuth, 'critical', {
        reason: i18n(
          'Finish the OpenAI Codex browser login so Hermes can make model calls.',
        ),
      })
      return {
        version: '1' as const,
        title: i18n('OpenAI Codex OAuth Started'),
        message: i18n(
          'Open the browser URL, enter the code, then run Complete OpenAI Codex OAuth.',
        ),
        result: {
          type: 'group' as const,
          value: [
            {
              name: i18n('Browser URL'),
              description: null,
              type: 'single' as const,
              value: CODEX_DEVICE_URL,
              copyable: true,
              qr: true,
              masked: false,
            },
            {
              name: i18n('Device Code'),
              description: null,
              type: 'single' as const,
              value: codexOAuth.userCode,
              copyable: true,
              qr: false,
              masked: false,
            },
          ],
        },
      }
    }

    await effects.restart()
  },
)
