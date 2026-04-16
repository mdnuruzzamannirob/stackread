'use client'

import { Play } from 'lucide-react'

interface ReadingProgressItem {
  id: string
  title: string
  author: string
  progress: number
  status: string
  coverColor: string
}

interface RecentActivityProps {
  items?: ReadingProgressItem[]
}

export function RecentActivity({
  items = [
    {
      id: '1',
      title: 'Shesher Kobita',
      author: 'Rabindranath Tagore',
      progress: 72,
      status: 'In Progress',
      coverColor: 'from-[#d58a57] to-[#f2c79f]',
    },
    {
      id: '2',
      title: 'Pather Panchali',
      author: 'Bibhutibhushan Bandyopadhyay',
      progress: 35,
      status: 'Just Started',
      coverColor: 'from-slate-300 to-slate-100',
    },
  ],
}: RecentActivityProps) {
  return (
    <section id="library" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-primary/70">
            Keep Exploring
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Reading Progress
          </h2>
        </div>

        <a
          href="#"
          className="hidden text-sm font-medium text-primary transition hover:text-primary-700 md:block"
        >
          View All Library
        </a>
      </div>

      <div className="space-y-4 rounded-[1.35rem] bg-transparent">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:px-5"
          >
            <div className="flex items-center gap-4 md:min-w-96">
              <div className="relative h-20 w-14 overflow-hidden rounded-sm bg-slate-100 ring-1 ring-slate-200">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${item.coverColor}`}
                />
                <div className="absolute inset-x-0 bottom-0 h-3 bg-white/40" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">{item.author}</p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-4">
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="min-w-24 text-right">
                <p className="text-lg font-semibold text-slate-900">
                  {item.progress}%
                </p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  {item.status}
                </p>
              </div>

              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-2xl bg-slate-50 text-primary transition hover:bg-primary hover:text-white"
                aria-label={`Open ${item.title}`}
              >
                <Play className="size-4 fill-current" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
