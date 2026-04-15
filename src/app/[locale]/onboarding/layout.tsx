import { redirect } from 'next/navigation'

import { serverApiRequest } from '@/lib/api/server'
import { getServerAccessToken } from '@/lib/auth/server-session'
import { env } from '@/lib/env'

type OnboardingStatusResponse = {
  status?: 'pending' | 'selected' | 'completed'
}

type UserProfile = {
  isEmailVerified?: boolean
}

async function hasValidUserSession(token: string) {
  const response = await fetch(`${env.apiBaseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  return response.ok
}

async function getMe(token: string) {
  return serverApiRequest<UserProfile>({
    path: '/auth/me',
    token,
  })
}

export default async function OnboardingLayout({
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

  const isValid = await hasValidUserSession(token)

  if (!isValid) {
    redirect(`/${locale}/auth/login`)
  }

  const me = await getMe(token)

  if (!me) {
    redirect(`/${locale}/auth/login`)
  }

  if (!me.isEmailVerified) {
    redirect(`/${locale}/auth/check-email`)
  }

  const status = await serverApiRequest<OnboardingStatusResponse>({
    path: '/onboarding/status',
    token,
  })

  if (status?.status === 'completed') {
    redirect(`/${locale}/dashboard`)
  }

  return <div className="min-h-screen bg-background px-4 py-8">{children}</div>
}
