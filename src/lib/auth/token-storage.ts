'use client'

type PersistSessionInput = {
  accessToken: string
  refreshToken?: string
}

const ACCESS_TOKEN_STORAGE_KEY = 'stackread_access_token'

export function persistSession({ accessToken }: PersistSessionInput) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function getStoredRefreshToken() {
  return null
}
