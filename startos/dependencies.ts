import { sdk } from './sdk'
import { configYaml } from './fileModels/configYaml'

// Map a config.yaml `model.provider` value to the StartOS package it needs.
// Only the local runtimes require a dependency; cloud/custom providers need none.
// (llama.cpp's provider id is `llamacpp`; its package id is `llama-cpp`.)
const PROVIDER_TO_DEP: Record<string, { dep: string; versionRange: string }> = {
  ollama: { dep: 'ollama', versionRange: '>=0.31.2:2' },
  vllm: { dep: 'vllm', versionRange: '>=0.23.1-rc.0:13' },
  llamacpp: { dep: 'llama-cpp', versionRange: '>=1.0.9994:1' },
}

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // Read Hermes' own config reactively so the dependency follows the live
  // backend selection — whether it was set via Configure Provider or edited in
  // the Hermes dashboard (two-way bound). No explicit re-trigger needed.
  const provider = await configYaml
    .read((c) => c.model?.provider)
    .const(effects)
  const match = provider ? PROVIDER_TO_DEP[provider] : undefined

  const deps: Record<
    string,
    { kind: 'running'; versionRange: string; healthChecks: string[] }
  > = {}
  if (match) {
    deps[match.dep] = {
      kind: 'running',
      versionRange: match.versionRange,
      healthChecks: ['primary'],
    }
  }
  return deps
})
