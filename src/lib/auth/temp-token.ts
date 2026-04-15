'use client'

const TEMP_TOKEN_STORAGE_KEY = 'stackread_temp_2fa_token'

export function persistTempToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(TEMP_TOKEN_STORAGE_KEY, token)
}

export function getPersistedTempToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage.getItem(TEMP_TOKEN_STORAGE_KEY)
}

export function clearPersistedTempToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(TEMP_TOKEN_STORAGE_KEY)
}
