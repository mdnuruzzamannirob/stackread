import { serverApiRequest } from '@/lib/api/server'
import { getServerAccessToken } from '@/lib/auth/server-session'

type LoginHistoryItem = {
  createdAt?: string
  ip?: string
  userAgent?: string
}

export default async function DashboardPage() {
  const token = await getServerAccessToken()
  const history = token
    ? await serverApiRequest<LoginHistoryItem[]>({
        path: '/auth/me/login-history',
        token,
      })
    : null

  return (
    <section className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Protected layout validation is active.
      </p>
      <p className="mt-4 text-sm">
        Login history rows loaded: {Array.isArray(history) ? history.length : 0}
      </p>
    </section>
  )
}
