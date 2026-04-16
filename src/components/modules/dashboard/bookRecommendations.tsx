'use client'

import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface BookRecommendation {
  id: string
  title: string
  author: string
  cover?: string
  genre: string
  rating: number
  description: string
}

interface BookRecommendationsProps {
  locale: string
  recommendations?: BookRecommendation[]
}

export function BookRecommendations({
  locale,
  recommendations = [
    {
      id: '1',
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      genre: 'Classic',
      rating: 4.9,
      description:
        'A delicate story of friendship, wonder, and what truly matters.',
    },
    {
      id: '2',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
      rating: 4.8,
      description:
        'A concise history of humankind written with bold perspective.',
    },
    {
      id: '3',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Philosophy',
      rating: 4.8,
      description:
        'A timeless reminder to follow the path that calls you most deeply.',
    },
  ],
}: BookRecommendationsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Editor's Choice For You
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Based on your recent interest in classic Bengali prose and modernist
            poetry, our curators suggest these limited editions.
          </p>
        </div>

        <Link
          href={`/${locale}/dashboard#recommendations`}
          className="hidden text-sm font-medium text-primary transition hover:text-primary-700 md:block"
        >
          View all
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-2xl border border-border bg-white text-slate-700 transition hover:border-primary/25 hover:text-primary"
            aria-label="Previous recommendations"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-2xl border border-border bg-white text-slate-700 transition hover:border-primary/25 hover:text-primary"
            aria-label="Next recommendations"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((book) => (
          <div
            key={book.id}
            className="group overflow-hidden rounded-2xl border border-white/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="grid grid-cols-[96px_1fr] gap-4">
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#f0d7c2] to-[#fff7ef] ring-1 ring-slate-100">
                <BookOpen className="size-9 text-slate-500/60 transition group-hover:text-primary" />
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
