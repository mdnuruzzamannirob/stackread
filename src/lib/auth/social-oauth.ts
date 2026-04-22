import { env } from '@/lib/env'

export type SocialOAuthProvider = 'google' | 'facebook'

const OAUTH_LOCALE_STORAGE_KEY = 'stackread_oauth_locale'

export function buildOAuthStartUrl(
  provider: SocialOAuthProvider,
  locale: string,
) {
  const url = new URL(`${env.apiBaseUrl}/auth/${provider}`)
  url.searchParams.set('locale', locale)
  return url.toString()
}

export function persistOAuthLocale(locale: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(OAUTH_LOCALE_STORAGE_KEY, locale)
}

export function getPersistedOAuthLocale() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage.getItem(OAUTH_LOCALE_STORAGE_KEY)
}

export function clearPersistedOAuthLocale() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(OAUTH_LOCALE_STORAGE_KEY)
}

export function redirectToOAuth(provider: SocialOAuthProvider, locale: string) {
  persistOAuthLocale(locale)
  window.location.assign(buildOAuthStartUrl(provider, locale))
}
