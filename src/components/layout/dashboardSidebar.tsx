'use client'

import useSidebar from '@/hooks/useSidebar'
import {
  Bell,
  BookOpen,
  CircleHelp,
  Compass,
  Languages,
  LibraryBig,
  LogOut,
  Settings,
  UserRound,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardSidebarProps {
  locale: string
}

export function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { closeSidebar } = useSidebar()

  const menuItems = [
    {
      label: 'Browse',
      href: `/${locale}/dashboard#browse`,
      icon: Compass,
    },
    {
      label: 'Library',
      href: `/${locale}/dashboard#library`,
      icon: LibraryBig,
    },
    {
      label: 'My Account',
      href: `/${locale}/dashboard`,
      icon: UserRound,
    },
    {
      label: 'Notifications',
      href: `/${locale}/notifications`,
      icon: Bell,
    },
    {
      label: 'Language',
      href: `/${locale}/dashboard#language`,
      icon: Languages,
    },
  ]

  const bottomLinks = [
    {
      label: 'Settings',
      href: `/${locale}/settings`,
      icon: Settings,
    },
    {
      label: 'Help',
      href: `/${locale}/dashboard#help`,
      icon: CircleHelp,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <BookOpen className="size-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-brand-600">
              StackRead
            </p>
            <p className="mt-1 text-[8px] uppercase tracking-[2.1px] text-neutral-500">
              Digital Curator
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={closeSidebar}
          className="rounded-xl border border-border bg-background p-2 text-slate-500 transition hover:border-primary/30 hover:text-primary md:hidden"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            (item.label === 'My Account' &&
              pathname.startsWith(`/${locale}/dashboard`)) ||
            (item.label === 'Notifications' &&
              pathname.startsWith(`/${locale}/notifications`)) ||
            pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-200 text-brand-600'
                  : 'text-slate-600 hover:bg-brand-100 hover:text-brand-600'
              }`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-lg bg-brand-200 p-4">
          <p className="text-sm font-semibold text-brand-900">
            Upgrade to Premium
          </p>
          <p className="mt-1 text-xs leading-5 text-brand-600">
            Unlock unlimited access to the full Bengali digital archive.
          </p>
          <button className="mt-4 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700">
            Get Started
          </button>
        </div>

        <div className="space-y-1.5 border-t border-border pt-4">
          {bottomLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeSidebar}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 duration-200 transition hover:bg-brand-100 hover:text-brand-600"
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button className="flex items-center w-full gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 duration-200 transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" /> <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
