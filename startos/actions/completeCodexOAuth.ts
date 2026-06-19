import { authJson } from '../fileModels/authJson'
import { configYaml } from '../fileModels/configYaml'
import { storeJson } from '../fileModels/store.json'
import { setDependencies } from '../dependencies'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { codexAuthPatch, completeCodexDeviceCode } from './codexOAuth'

export const completeCodexOAuth = sdk.Action.withoutInput(
  'complete-codex-oauth',

  async ({ effects }) => ({
    name: i18n('Complete OpenAI Codex OAuth'),
    description: i18n(
      'Finish the OpenAI Codex browser login after entering the device code',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const pending = await storeJson
      .read((s) => s.codexOAuth)
      .once()
      .catch(() => undefined)

    if (!pending?.deviceAuthId || !pending?.userCode || !pending?.model) {
      throw new Error(
        i18n(
          'No OpenAI Codex browser login is pending. Run Configure Provider and choose OpenAI Codex OAuth first.',
        ),
      )
    }

    const tokens = await completeCodexDeviceCode(pending)
    await authJson.merge(effects, codexAuthPatch(tokens))
    await configYaml.merge(effects, {
      model: {
        provider: 'openai-codex',
        base_url: undefined,
        api_key: undefined,
        default: pending.model,
      },
    })
    await storeJson.merge(effects, {
      backend: 'cloud',
      provider: 'openai-codex',
      codexOAuth: undefined,
    })
    await setDependencies(effects)
    await effects.restart()

    return {
      version: '1' as const,
      title: i18n('OpenAI Codex OAuth Complete'),
      message: i18n('Hermes is now configured to use OpenAI Codex OAuth.'),
      result: null,
    }
  },
)
