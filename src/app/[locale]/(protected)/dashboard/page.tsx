import { SubscriptionManagementCard } from '@/components/subscription/subscription-management-card'
import { serverApiRequest } from '@/lib/api/server'
import { getServerAccessToken } from '@/lib/auth/server-session'
import Link from 'next/link'

type LoginHistoryItem = {
  createdAt?: string
  ipAddress?: string
  userAgent?: string
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const token = await getServerAccessToken()
  const history = token
    ? await serverApiRequest<LoginHistoryItem[]>({
        path: '/auth/me/login-history',
        token,
      })
    : null

  const topics = [
    { title: 'Books', description: 'Explore catalog and availability.' },
    { title: 'Authors', description: 'Follow your favorite writers.' },
    { title: 'Categories', description: 'Browse by genre and mood.' },
    { title: 'Wishlist', description: 'Save books for later reading.' },
  ]

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to your reading workspace. Start from topics or manage your
            account.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/${locale}/profile`}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Open profile
          </Link>
          <Link
            href={`/${locale}/settings`}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Open settings
          </Link>
          <Link
            href={`/${locale}/security`}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Open security (2FA)
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <article
            key={topic.title}
            className="rounded-xl border border-border bg-card p-4"
          >
            <h2 className="font-semibold">{topic.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {topic.description}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">Recent login history</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rows found: {Array.isArray(history) ? history.length : 0}
        </p>
      </div>

      <SubscriptionManagementCard />
    </section>
  )
}
