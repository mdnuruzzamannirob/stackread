'use client'

import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AuthLinks({ locale }: { locale: string }) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href={`/${locale}/auth/login`}
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
      >
        Login
      </Link>

      <Link
        href={`/${locale}/auth/register`}
        className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
      >
        Register
      </Link>
    </div>
  )
}
