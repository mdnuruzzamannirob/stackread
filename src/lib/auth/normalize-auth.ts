import type { LoginPayload, UserProfile } from '@/store/features/auth/types'

type AnyRecord = Record<string, unknown>

export function extractLoginPayload(input: unknown): LoginPayload | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const payload = input as AnyRecord
  const requiresTwoFactor = Boolean(payload.requiresTwoFactor)

  if (requiresTwoFactor) {
    const tempToken =
      typeof payload.tempToken === 'string' ? payload.tempToken : null
    if (!tempToken) {
      return null
    }

    return {
      requiresTwoFactor: true,
      tempToken,
    }
  }

  const accessToken =
    typeof payload.accessToken === 'string' ? payload.accessToken : null
  const user = (payload.user ?? null) as UserProfile | null

  if (!accessToken || !user) {
    return null
  }

  return {
    requiresTwoFactor: false,
    accessToken,
    refreshToken:
      typeof payload.refreshToken === 'string'
        ? payload.refreshToken
        : undefined,
    user,
  }
}

export function extractRegisterSession(
  input: unknown,
): { accessToken: string; refreshToken?: string; user: UserProfile } | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const payload = input as AnyRecord
  const user = (payload.user ?? null) as UserProfile | null
  const tokens = (payload.tokens ?? null) as {
    accessToken?: string
    refreshToken?: string
  } | null

  if (!user || !tokens?.accessToken) {
    return null
  }

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }
}

export function extractSession(
  input: unknown,
): { accessToken: string; refreshToken?: string; user: UserProfile } | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const payload = input as AnyRecord
  const accessToken =
    typeof payload.accessToken === 'string' ? payload.accessToken : null
  const user = (payload.user ?? null) as UserProfile | null

  if (!accessToken || !user) {
    return null
  }

  return {
    accessToken,
    refreshToken:
      typeof payload.refreshToken === 'string'
        ? payload.refreshToken
        : undefined,
    user,
  }
}
