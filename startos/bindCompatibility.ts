import type { sdk } from './sdk'

type Effects = Parameters<typeof sdk.MultiHost.of>[0]
type BindOptions = Parameters<Effects['bind']>[0]

// Retry only explicit parameter deserialization: bind definitely did not run.
// SDK 3 uses ALPN arrays; older hosts require the tagged enum wire format.
export const withAlpnCompatibility = (effects: Effects): Effects =>
  Object.assign(Object.create(effects), {
    async bind(options: BindOptions) {
      try {
        return await effects.bind(options)
      } catch (error) {
        const message = String(error)
        if (
          !Array.isArray(options.addSsl?.alpn) ||
          !message.includes('Invalid params: Deserialization Error:') ||
          !message.includes('invalid type: sequence, expected string or map') ||
          !message.includes('@bind')
        ) {
          throw error
        }
        const compatible = {
          ...options,
          addSsl: {
            ...options.addSsl,
            alpn: { specified: [...options.addSsl.alpn] },
          },
        }
        // Change only ALPN; preserve TLS, authentication and interface policy.
        return await effects.bind(compatible as unknown as BindOptions)
      }
    },
  })
