import { sdk } from '../sdk'
import { configYaml } from '../fileModels/configYaml'
import { envFile } from '../fileModels/envFile'
import { storeJson } from '../fileModels/store.json'
import { readDependencyApiKey } from '../publicCredentials'
import { setDependencies } from '../dependencies'
import { i18n } from '../i18n'
import { completeCodexOAuth } from './completeCodexOAuth'
import { CODEX_DEVICE_URL, requestCodexDeviceCode } from './codexOAuth'

const { InputSpec, Value, Variants } = sdk

// Local-inference backends are auto-wired to the registry packages' addresses
// (OpenAI-compatible `/v1` paths — Hermes treats ollama/vllm as `custom`).
const OLLAMA_BASE_URL = 'http://ollama.startos:11434/v1'
const VLLM_BASE_URL = 'http://vllm.startos:8000/v1'
const LLAMA_CPP_BASE_URL = 'http://llama-cpp.startos:8080/v1'
// xAI's API is OpenAI-compatible; routed as `custom` with this base URL.
const GROK_BASE_URL = 'https://api.x.ai/v1'

const modelField = Value.text({
  name: i18n('Model'),
  description: i18n('The model identifier to use (e.g. the served model name)'),
  required: true,
  default: null,
})

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
      model: modelField,
    }),
  },
  'openai-codex': {
    name: i18n('OpenAI Codex OAuth'),
    spec: InputSpec.of({ model: modelField }),
  },
  gemini: {
    name: i18n('Google Gemini'),
    spec: InputSpec.of({ apiKey: apiKeyField('...'), model: modelField }),
  },
  grok: {
    name: i18n('xAI Grok'),
    spec: InputSpec.of({ apiKey: apiKeyField('xai-...'), model: modelField }),
  },
  ollama: {
    name: i18n('Ollama (local)'),
    spec: InputSpec.of({ model: modelField }),
  },
  vllm: {
    name: i18n('vLLM (local)'),
    spec: InputSpec.of({ model: modelField }),
  },
  'llama-cpp': {
    name: i18n('llama.cpp (local)'),
    spec: InputSpec.of({ model: modelField }),
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
            value: { model: modelId },
          },
        }
      case 'grok':
        return {
          provider: { selection: 'grok' as const, value: { model: modelId } },
        }
      case 'gemini':
        return {
          provider: { selection: 'gemini' as const, value: { model: modelId } },
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
    // `ollama`/`vllm` aliases. Gemini is a named provider, keyed from .env.
    // OpenAI Codex OAuth is a named provider keyed from auth.json.
    let model: {
      provider: string
      base_url: string | undefined
      api_key: string | undefined
      default: string
    }
    let backend: 'cloud' | 'ollama' | 'vllm' | 'llama-cpp'
    const envPatch: Record<string, string | undefined> = {}
    let codexOAuth:
      | Awaited<ReturnType<typeof requestCodexDeviceCode>>
      | undefined

    if (p.selection === 'ollama') {
      backend = 'ollama'
      model = {
        provider: 'ollama',
        base_url: OLLAMA_BASE_URL,
        api_key: undefined,
        default: p.value.model,
      }
    } else if (p.selection === 'vllm') {
      backend = 'vllm'
      const key = await readDependencyApiKey(effects, 'vllm')
      if (!key) {
        throw new Error(
          'vLLM is selected but its API key could not be read from vllm:public/credentials.json. Make sure vLLM is installed, running, and at a version that publishes its public credentials (>=0.16.0:0.1).',
        )
      }
      model = {
        provider: 'vllm',
        base_url: VLLM_BASE_URL,
        api_key: key,
        default: p.value.model,
      }
    } else if (p.selection === 'llama-cpp') {
      // llama.cpp runs keyless; its basic auth is enforced only at the OS
      // reverse-proxy edge, so internal `.startos` connections need none.
      backend = 'llama-cpp'
      model = {
        provider: 'llamacpp',
        base_url: LLAMA_CPP_BASE_URL,
        api_key: undefined,
        default: p.value.model,
      }
    } else if (p.selection === 'openai-compatible') {
      backend = 'cloud'
      model = {
        provider: 'custom',
        base_url: p.value.baseUrl,
        api_key: p.value.apiKey,
        default: p.value.model,
      }
    } else if (p.selection === 'openai-codex') {
      backend = 'cloud'
      codexOAuth = await requestCodexDeviceCode(p.value.model)
      model = {
        provider: 'openai-codex',
        base_url: undefined,
        api_key: undefined,
        default: p.value.model,
      }
    } else if (p.selection === 'grok') {
      backend = 'cloud'
      model = {
        provider: 'custom',
        base_url: GROK_BASE_URL,
        api_key: p.value.apiKey,
        default: p.value.model,
      }
    } else if (p.selection === 'gemini') {
      backend = 'cloud'
      model = {
        provider: 'gemini',
        base_url: undefined,
        api_key: undefined,
        default: p.value.model,
      }
      envPatch.GEMINI_API_KEY = p.value.apiKey
    } else {
      throw new Error('Unknown provider selection')
    }

    await configYaml.merge(effects, { model })
    if (Object.keys(envPatch).length > 0) await envFile.merge(effects, envPatch)
    await storeJson.merge(effects, {
      backend,
      provider: p.selection,
      codexOAuth,
    })

    await setDependencies(effects)
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
