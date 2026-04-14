export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
  supportedLocales: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ?? 'en,bn')
    .split(',')
    .map((locale) => locale.trim())
    .filter(Boolean),
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? 'stackread_session',
}
