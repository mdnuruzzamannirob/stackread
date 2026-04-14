import { redirect } from 'next/navigation'

import { getServerAccessToken } from '@/lib/auth/server-session'
import { env } from '@/lib/env'

async function hasValidUserSession(token: string) {
  const response = await fetch(`${env.apiBaseUrl}/auth/me/login-history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  return response.ok
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

  const isValid = await hasValidUserSession(token)

  if (!isValid) {
    redirect(`/${locale}/auth/login`)
  }

  return <div className="min-h-screen bg-background px-4 py-8">{children}</div>
}
