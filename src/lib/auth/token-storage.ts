'use client'

import { env } from '@/lib/env'

const ACCESS_TOKEN_KEY = 'stackread_access_token'
const REFRESH_TOKEN_KEY = 'stackread_refresh_token'

type PersistSessionInput = {
  accessToken: string
  refreshToken?: string
}

export function persistSession({
  accessToken,
  refreshToken,
}: PersistSessionInput) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  document.cookie = `${env.sessionCookieName}=${accessToken}; Path=/; SameSite=Lax`
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  document.cookie = `${env.sessionCookieName}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredRefreshToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY)
}
