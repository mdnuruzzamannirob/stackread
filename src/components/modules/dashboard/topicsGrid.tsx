'use client'

interface TopicsGridProps {
  locale: string
  topics?: string[]
}

export function TopicsGrid({
  locale,
  topics = ['Science Fiction', 'Philosophy', 'History', 'Art', 'Biography'],
}: TopicsGridProps) {
  return (
    <section id="genres" aria-label={`Popular genres in ${locale}`}>
      <h3 className="text-lg font-semibold text-slate-900">Popular Genres</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary/25 hover:text-primary"
          >
            {topic}
          </button>
        ))}
      </div>
    </section>
  )
}
