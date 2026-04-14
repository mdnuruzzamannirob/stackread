import { defineRouting } from 'next-intl/routing'

import { env } from '@/lib/env'

const locales =
  env.supportedLocales.length > 0 ? env.supportedLocales : ['en', 'bn']

export const routing = defineRouting({
  locales,
  defaultLocale: env.defaultLocale,
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
