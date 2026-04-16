'use client'

import { BookOpen, Heart, MessageSquareText, Sparkles } from 'lucide-react'
import { useMemo } from 'react'

interface ReadingStatsProps {
  booksRead?: number
  readingNow?: number
  wishlistCount?: number
  reviewsCount?: number
  planName?: string
  daysLeft?: number
  renewalDate?: string
  autoRenew?: boolean
}

export function ReadingStats({
  booksRead = 42,
  readingNow = 3,
  wishlistCount = 128,
  reviewsCount = 15,
  planName = 'Basic Plan',
  daysLeft = 22,
  renewalDate = 'Oct 24, 2024',
  autoRenew = true,
}: ReadingStatsProps) {
  const stats = [
    {
      label: 'Books Read',
      value: booksRead,
      icon: BookOpen,
    },
    {
      label: 'Reading',
      value: readingNow,
      icon: Sparkles,
    },
    {
      label: 'Wishlist',
      value: wishlistCount,
      icon: Heart,
    },
    {
      label: 'Reviews',
      value: reviewsCount,
      icon: MessageSquareText,
    },
  ]

  const progressValue = useMemo(() => {
    const total = 30
    return Math.min(100, Math.round((daysLeft / total) * 100))
  }, [daysLeft])

  return (
    <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.25fr]">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.label}
            className="min-h-52 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition duration-200 hover:border-primary/20"
          >
            <Icon className="size-5 text-slate-600" />
            <p className="mt-10 text-3xl font-semibold tracking-tight text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {stat.label}
            </p>
          </div>
        )
      })}

      <aside className="rounded-2xl border border-[#cfe0f8] bg-[#eaf2ff] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900">{planName}</p>
            <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              Active
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              {daysLeft}
            </p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Days Left
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Renewal Date</span>
            <span className="font-medium text-slate-900">{renewalDate}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Auto-renew</span>
            <span className="inline-flex h-5 w-11 items-center rounded-full bg-primary px-1">
              <span className="ml-auto size-3.5 rounded-full bg-white shadow-sm" />
            </span>
          </div>

          <div className="h-2 rounded-full bg-white/70">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(2,132,199,0.22)] transition hover:bg-primary-700">
            Upgrade to Premium
          </button>
        </div>
      </aside>
    </div>
  )
}
