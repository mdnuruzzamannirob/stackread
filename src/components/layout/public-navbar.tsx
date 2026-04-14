import Link from 'next/link'

import { LocaleSwitcher } from '@/components/common/locale-switcher'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function PublicNavbar({ locale }: { locale: string }) {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight"
        >
          Stackread
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher currentLocale={locale} />
          <Link href={`/${locale}/auth/login`}>Login</Link>
        </div>
      </div>
    </header>
  )
}
