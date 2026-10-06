import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { configYaml } from './fileModels/configYaml'

// Enabled by config.yaml's `model.provider`; llama.cpp's provider id is `llamacpp`.
const providerIs =
  (provider: string) =>
  async ({ effects }: { effects: T.Effects }) =>
    (await configYaml.read((c) => c.model?.provider).const(effects)) ===
    provider

const ollama = sdk.Dependency.optional('ollama', {
  description: {
    en_US:
      'Optional: host local LLMs with Ollama. Select it as your backend in the Configure Provider action.',
  },
  metadata: {
    icon: 'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
    title: 'Ollama',
  },
  versionRange: '>=0.31.2:2',
  kind: 'running',
  healthChecks: ['primary'],
  enabled: providerIs('ollama'),
})

const vllm = sdk.Dependency.optional('vllm', {
  description: {
    en_US:
      "Optional: serve local LLMs through vLLM's OpenAI-compatible API. Select it as your backend in the Configure Provider action.",
  },
  metadata: {
    icon: 'https://raw.githubusercontent.com/Start9Labs/vllm-startos/master/icon.svg',
    title: 'vLLM',
  },
  versionRange: '>=0.23.1-rc.0:13',
  kind: 'running',
  healthChecks: ['primary'],
  enabled: providerIs('vllm'),
})

const llamaCpp = sdk.Dependency.optional('llama-cpp', {
  description: {
    en_US:
      'Optional: run local GGUF models with llama.cpp. Select it as your backend in the Configure Provider action.',
  },
  metadata: {
    icon: 'https://raw.githubusercontent.com/Start9Labs/llama-cpp-startos/master/icon.png',
    title: 'llama.cpp',
  },
  versionRange: '>=1.0.9994:1',
  kind: 'running',
  healthChecks: ['primary'],
  enabled: providerIs('llamacpp'),
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(ollama)
  .addDependency(vllm)
  .addDependency(llamaCpp)
