import { setupManifest } from '@start9labs/start-sdk'
import { STARTOS_VERSION } from '../utils'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'hermes-agent',
  title: 'Hermes Agent',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/hermes-agent-startos',
  upstreamRepo: 'https://github.com/NousResearch/hermes-agent',
  marketingUrl: 'https://hermes-agent.nousresearch.com',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    'hermes-agent': {
      source: {
        dockerBuild: {
          workdir: '.',
          buildArgs: {
            STARTOS_VERSION,
          },
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // Declared optional here; setupDependencies (dependencies.ts) flips them to
  // `running` deps based on the Configure Provider selection.
  dependencies: {
    ollama: {
      optional: true,
      description: {
        en_US:
          'Optional: host local LLMs with Ollama. Select it as your backend in the Configure Provider action.',
      },
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
        title: 'Ollama',
      },
    },
    vllm: {
      optional: true,
      description: {
        en_US:
          "Optional: serve local LLMs through vLLM's OpenAI-compatible API. Select it as your backend in the Configure Provider action.",
      },
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/vllm-startos/master/icon.svg',
        title: 'vLLM',
      },
    },
    'llama-cpp': {
      optional: true,
      description: {
        en_US:
          'Optional: run local GGUF models with llama.cpp. Select it as your backend in the Configure Provider action.',
      },
      metadata: {
        icon: 'https://raw.githubusercontent.com/Start9Labs/llama-cpp-startos/master/icon.png',
        title: 'llama.cpp',
      },
    },
  },
})
