import {
  BookRecommendations,
  ReadingStats,
  RecentActivity,
  TopicsGrid,
} from '@/components/modules/dashboard'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <section id="browse" className=" w-full space-y-8">
      <ReadingStats />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="space-y-10">
          <RecentActivity />
          <BookRecommendations locale={locale} />
        </div>

        <aside id="notifications" className="space-y-8 pt-1">
          <div className="rounded-2xl border border-transparent bg-transparent px-1 py-1">
            <div className="border-l-4 border-[#a86c4e] pl-4 text-slate-700">
              <p className="text-base leading-8 italic text-slate-700">
                “A reader lives a thousand lives before he dies. The man who
                never reads lives only one.”
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                — George R.R. Martin
              </p>
            </div>
          </div>

          <TopicsGrid locale={locale} />
        </aside>
      </div>
    </section>
  )
}
