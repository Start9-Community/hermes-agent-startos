import { setupManifest } from '@start9labs/start-sdk'
import { START_CLI_VERSION } from '../utils'
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
            START_CLI_VERSION,
          },
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
