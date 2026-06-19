const CODEX_OAUTH_CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann'
const CODEX_ISSUER = 'https://auth.openai.com'
const CODEX_TOKEN_URL = `${CODEX_ISSUER}/oauth/token`

export const CODEX_DEVICE_URL = `${CODEX_ISSUER}/codex/device`

export type CodexOAuthPending = {
  userCode: string
  deviceAuthId: string
  pollIntervalSeconds: number
  expiresAt: string
  model: string
}

export type CodexTokens = {
  access_token: string
  refresh_token: string
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function asPositiveInteger(value: unknown, fallback: number): number {
  const n =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

function retryAfterSeconds(headers: Headers): number | null {
  const raw = headers.get('retry-after')
  if (!raw) return null
  const seconds = Number.parseInt(raw, 10)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null
}

async function delay(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

async function readJson(resp: Response): Promise<Record<string, unknown>> {
  const data = await resp.json().catch(() => ({}))
  return data && typeof data === 'object'
    ? (data as Record<string, unknown>)
    : {}
}

export async function requestCodexDeviceCode(
  model: string,
): Promise<CodexOAuthPending> {
  let resp: Response | null = null
  const maxAttempts = 4

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    resp = await fetch(`${CODEX_ISSUER}/api/accounts/deviceauth/usercode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CODEX_OAUTH_CLIENT_ID }),
    })

    if (resp.status !== 429) break
    if (attempt < maxAttempts) {
      const retryAfter = retryAfterSeconds(resp.headers)
      await delay(Math.max(1, Math.min(retryAfter ?? 2 ** attempt, 60)))
    }
  }

  if (!resp) throw new Error('OpenAI Codex device-code request did not run')
  if (resp.status === 429) {
    const retryAfter = retryAfterSeconds(resp.headers)
    throw new Error(
      retryAfter
        ? `OpenAI is rate-limiting Codex login requests. Try again in about ${retryAfter}s.`
        : 'OpenAI is rate-limiting Codex login requests. Wait a minute and try again.',
    )
  }
  if (resp.status !== 200) {
    throw new Error(`Codex device-code request returned HTTP ${resp.status}`)
  }

  const data = await readJson(resp)
  const userCode = asString(data.user_code)
  const deviceAuthId = asString(data.device_auth_id)
  const pollIntervalSeconds = Math.max(3, asPositiveInteger(data.interval, 5))
  const expiresInSeconds = asPositiveInteger(data.expires_in, 15 * 60)

  if (!userCode || !deviceAuthId) {
    throw new Error('Codex device-code response was missing required fields')
  }

  return {
    userCode,
    deviceAuthId,
    pollIntervalSeconds,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    model,
  }
}

export async function completeCodexDeviceCode(
  pending: CodexOAuthPending,
): Promise<CodexTokens> {
  if (Date.parse(pending.expiresAt) <= Date.now()) {
    throw new Error(
      'The OpenAI Codex browser login expired. Run Configure Provider again.',
    )
  }

  const maxWaitMs = 90 * 1000
  const start = Date.now()
  let codeResp: Record<string, unknown> | null = null

  while (Date.now() - start < maxWaitMs) {
    const pollResp = await fetch(
      `${CODEX_ISSUER}/api/accounts/deviceauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_auth_id: pending.deviceAuthId,
          user_code: pending.userCode,
        }),
      },
    )

    if (pollResp.status === 200) {
      codeResp = await readJson(pollResp)
      break
    }
    if (pollResp.status !== 403 && pollResp.status !== 404) {
      throw new Error(
        `Codex browser-login polling returned HTTP ${pollResp.status}`,
      )
    }

    const remainingSeconds = Math.max(
      1,
      (maxWaitMs - (Date.now() - start)) / 1000,
    )
    await delay(Math.min(pending.pollIntervalSeconds, remainingSeconds))
  }

  if (!codeResp) {
    throw new Error(
      `OpenAI has not confirmed the browser login yet. Open ${CODEX_DEVICE_URL}, enter ${pending.userCode}, then run this action again.`,
    )
  }

  const authorizationCode = asString(codeResp.authorization_code)
  const codeVerifier = asString(codeResp.code_verifier)
  if (!authorizationCode || !codeVerifier) {
    throw new Error(
      'Codex browser-login response was missing token exchange fields',
    )
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: `${CODEX_ISSUER}/deviceauth/callback`,
    client_id: CODEX_OAUTH_CLIENT_ID,
    code_verifier: codeVerifier,
  })

  const tokenResp = await fetch(CODEX_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (tokenResp.status === 429) {
    const retryAfter = retryAfterSeconds(tokenResp.headers)
    throw new Error(
      retryAfter
        ? `OpenAI is rate-limiting Codex token exchange. Try again in about ${retryAfter}s.`
        : 'OpenAI is rate-limiting Codex token exchange. Wait a minute and try again.',
    )
  }
  if (tokenResp.status !== 200) {
    throw new Error(`Codex token exchange returned HTTP ${tokenResp.status}`)
  }

  const tokens = await readJson(tokenResp)
  const accessToken = asString(tokens.access_token)
  const refreshToken = asString(tokens.refresh_token)
  if (!accessToken || !refreshToken) {
    throw new Error(
      'Codex token exchange did not return both access and refresh tokens',
    )
  }

  return { access_token: accessToken, refresh_token: refreshToken }
}

export function codexAuthPatch(tokens: CodexTokens) {
  return {
    version: 1,
    providers: {
      'openai-codex': {
        tokens,
        last_refresh: new Date().toISOString(),
        auth_mode: 'chatgpt',
      },
    },
    active_provider: 'openai-codex',
  }
}
