'use client'

import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface BookRecommendation {
  id: string
  title: string
  author: string
  coverUrl?: string | null
  genre: string
  rating: number
  description: string
}

interface BookRecommendationsProps {
  locale: string
  recommendations?: BookRecommendation[]
  isLoading?: boolean
  hasError?: boolean
}

export function BookRecommendations({
  locale,
  recommendations = [],
  isLoading = false,
  hasError = false,
}: BookRecommendationsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Recommended For You
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Personalized picks generated from your reading behavior and catalog
            affinity.
          </p>
        </div>

        <Link
          href={`/${locale}/search`}
          className="hidden text-sm font-medium text-primary transition hover:text-primary-700 md:block"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          Loading recommendations...
        </p>
      ) : null}

      {hasError ? (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-600">
          Unable to load recommendations right now.
        </p>
      ) : null}

      {!isLoading && !hasError && !recommendations.length ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          Recommendations will appear after a little more reading activity.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((book) => (
          <div
            key={book.id}
            className="group overflow-hidden rounded-2xl border border-white/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="grid grid-cols-[96px_1fr] gap-4">
              <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#f0d7c2] to-[#fff7ef] ring-1 ring-slate-100">
                {book.coverUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${book.coverUrl})` }}
                  />
                ) : null}
                <BookOpen className="relative z-10 size-9 text-slate-500/60 transition group-hover:text-primary" />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {book.genre}
                </span>
                <h3 className="mt-2 text-lg font-semibold leading-6 text-slate-900">
                  {book.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{book.author}</p>

                <div className="mt-3 flex items-center gap-1 text-amber-500">
                  <span className="text-sm font-semibold text-slate-900">
                    {book.rating}
                  </span>
                  <span className="text-sm">★</span>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {book.description}
                </p>

                <Link
                  href={`/${locale}/books/${book.id}`}
                  className="mt-3 inline-flex text-xs font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  Open details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
