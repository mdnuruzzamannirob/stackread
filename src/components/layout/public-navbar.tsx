import Link from 'next/link'

import { AuthLinks } from '@/components/common/auth-links'
import { LocaleSwitcher } from '@/components/common/locale-switcher'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function PublicNavbar({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href={`/${locale}`}
          className="text-2xl font-bold tracking-tight text-primary"
        >
          StackRead
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition"
          >
            Browse
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition"
          >
            Library
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition"
          >
            My Account
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher currentLocale={locale} />
          <AuthLinks locale={locale} />
        </div>
      </div>
    </header>
  )
}
