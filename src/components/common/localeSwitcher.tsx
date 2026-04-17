'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { routing } from '@/i18n/routing'

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const nextLocale = currentLocale === 'en' ? 'bn' : 'en'

    if (!routing.locales.includes(nextLocale)) {
      return
    }

    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) {
      router.push(`/${nextLocale}`)
      return
    }

    if (routing.locales.includes(segments[0])) {
      segments[0] = nextLocale
      router.push(`/${segments.join('/')}`)
      return
    }

    router.push(`/${nextLocale}/${segments.join('/')}`)
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={switchLocale}
      className={'size-10'}
    >
      {currentLocale === 'en' ? 'BN' : 'EN'}
    </Button>
  )
}
