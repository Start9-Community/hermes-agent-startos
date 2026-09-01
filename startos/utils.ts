import { randomBytes, scryptSync } from 'node:crypto'
import { sdk } from './sdk'

// Hermes dashboard (web UI + in-browser chat). Bound as the StartOS `ui` interface.
// 9119 is the upstream default (HERMES_DASHBOARD_PORT).
export const dashboardPort = 9119

// The dashboard login. Hermes' BasicAuthProvider declines to register without a
// username and a password hash, and its auth gate refuses a non-loopback bind with
// no provider registered — so these are what let the `ui` interface bind at all.
export const dashboardUsername = 'admin'

/**
 * Compute the value Hermes expects in `config.yaml`'s
 * `dashboard.basic_auth.password_hash`.
 *
 * Hermes derives the key with stdlib `hashlib.scrypt` — N=2^14, r=8, p=1, a
 * 16-byte random salt and a 32-byte derived key — framed as
 * `scrypt$N$r$p$<base64 salt>$<base64 key>`. Format read from
 * `plugins/dashboard_auth/basic.hash_password` and round-tripped against that
 * module's `_verify_password` in the pinned image, both directions. scrypt needs
 * 128*N*r bytes (16 MiB), which fits under node's 32 MiB default `maxmem`.
 *
 * Upstream exposes no CLI to set the password, so writing the hash into
 * `config.yaml` is the documented path.
 */
export function hermesPasswordHash(password: string): string {
  const N = 16384
  const r = 8
  const p = 1
  const salt = randomBytes(16)
  const key = scryptSync(password, salt, 32, { N, r, p })
  return `scrypt$${N}$${r}$${p}$${salt.toString('base64')}$${key.toString('base64')}`
}

// Hermes data dir on the volume — matches the upstream image (HOME=/opt/data, uid 1000).
export const dataDir = '/opt/data'

// Image-owned managed context (skills + baseline knowledge bundle). Lives outside
// the data volume so the agent cannot edit it and it updates with package upgrades.
export const skillsDir = '/opt/startos/skills'
export const baselineBundlePath = '/opt/startos/knowledge/bundle.json'
// Where the (refreshable) live bundle is kept on the data volume.
export const bundlePath = `${dataDir}/.startos/knowledge/bundle.json`

// Upstream Hermes version this package wraps (mirror of the pinned image tag).
export const HERMES_VERSION = '2026.8.31'

// start-cli release whose binary the image installs (see UPDATING.md).
export const START_CLI_VERSION = '1.1.0'

// support-server's published knowledge bundle (full doc text + known issues +
// registry package info). Periodically re-fetched in the background.
export const BUNDLE_URL = 'https://start9.me/_api/knowledge/bundle'

export function mainMounts() {
  return sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: dataDir,
    readonly: false,
  })
}
