import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { serverApiRequest } from '@/lib/api/server'

type HealthPayload = {
  status?: string
  uptime?: number
}

type MaintenancePayload = {
  enabled?: boolean
  message?: string
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [health, maintenance] = await Promise.all([
    serverApiRequest<HealthPayload>({ path: '/health' }),
    serverApiRequest<MaintenancePayload>({
      path: '/admin/settings/maintenance',
    }),
  ])

  const healthy = health?.status ?? 'unknown'
  const maintenanceEnabled = Boolean(maintenance?.enabled)

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-border bg-card p-8">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Phase 1 foundation live
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Read smarter with Stackread
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Next.js 16 foundation with locale routing, theme support, Redux state,
          and backend readiness checks.
        </p>
        <div className="mt-6 flex gap-3">
          <Button>
            <Link href={`/${locale}/auth/register`}>Create account</Link>
          </Button>
          <Button variant="outline">
            <Link href={`/${locale}/auth/login`}>Sign in</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Backend Health</h2>
          <p className="mt-2 text-sm text-muted-foreground">GET /health</p>
          <p className="mt-4 text-sm">Status: {healthy}</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Maintenance State</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            GET /admin/settings/maintenance
          </p>
          <p className="mt-4 text-sm">
            Enabled: {maintenanceEnabled ? 'yes' : 'no'}
          </p>
          {maintenance?.message ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {maintenance.message}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  )
}
