import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/common/logout-button'
import { serverApiRequest } from '@/lib/api/server'
import { getServerAccessToken } from '@/lib/auth/server-session'

type OnboardingStatusResponse = {
  status?: 'pending' | 'selected' | 'completed'
}

async function getOnboardingStatus(token: string) {
  return serverApiRequest<OnboardingStatusResponse>({
    path: '/onboarding/status',
    token,
  })
}

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const token = await getServerAccessToken()

  if (!token) {
    redirect(`/${locale}/auth/login`)
  }

  const onboarding = await getOnboardingStatus(token)

  if (!onboarding) {
    redirect(`/${locale}/auth/login`)
  }

  if (onboarding?.status === 'pending' || onboarding?.status === 'selected') {
    redirect(`/${locale}/onboarding/plan-selection`)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto mb-6 flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href={`/${locale}/dashboard`}
            className="rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            Dashboard
          </Link>
          <Link
            href={`/${locale}/dashboard#subscription-management`}
            className="rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            Subscription
          </Link>
          <Link
            href={`/${locale}/profile`}
            className="rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            Profile
          </Link>
          <Link
            href={`/${locale}/settings`}
            className="rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            Settings
          </Link>
          <Link
            href={`/${locale}/security`}
            className="rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            Security (2FA)
          </Link>
        </nav>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}
