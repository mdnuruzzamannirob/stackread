'use client'

import useSidebar from '@/hooks/useSidebar'
import { Bell, Menu, Search, Sun, UserCircle2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  locale: string
  title: string
}

export function DashboardHeader({ locale, title }: DashboardHeaderProps) {
  const { toggleSidebar } = useSidebar()
  return (
    <div className="fixed left-0 right-0 bg-brand-50 top-0 z-40 md:left-60">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex size-10 items-center justify-center rounded-2xl border border-border bg-white text-slate-500 shadow-sm transition hover:border-primary/25 hover:text-primary md:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="size-5" />
          </button>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center focus-within:border-brand-600 gap-2 rounded-lg bg-white border border-neutral-200 px-3 py-2">
            <Search className="size-5" />

            <input
              type="text"
              name=""
              id=""
              className="border-none outline-none"
            />
            <span className="text-xs text-muted-foreground bg-black/5 rounded px-1 py-0.5 ml-auto">
              ^ + K
            </span>
          </div>

          <button
            className="flex size-10 items-center justify-center rounded-lg border bg-white border-neutral-200 text-neutral-500 hover:text-brand-600 "
            aria-label="Open profile"
          >
            <Sun className="size-5" />
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-lg border bg-white border-neutral-200 text-neutral-500 hover:text-brand-600 "
            aria-label="Open profile"
          >
            En
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-lg border bg-white border-neutral-200 text-neutral-500 hover:text-brand-600 "
            aria-label="Open profile"
          >
            <Bell className="size-5" />
          </button>
          <Link
            href={`/${locale}/profile`}
            className="flex size-10 items-center justify-center rounded-lg  bg-brand-600 text-white transition hover:bg-brand-700"
            aria-label="Open profile"
          >
            <UserCircle2 className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
