'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { persistSession } from '@/lib/auth/token-storage'
import {
  setAuthenticatedSession,
  setLoginOutcome,
} from '@/store/features/auth/authSlice'
import type { UserProfile } from '@/store/features/auth/types'
import { useAppDispatch } from '@/store/hooks'

export default function OAuthCallbackPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const tempToken = searchParams.get('tempToken')
    const requiresTwoFactor = searchParams.get('requiresTwoFactor') === 'true'

    if (requiresTwoFactor && tempToken) {
      dispatch(
        setLoginOutcome({
          requiresTwoFactor: true,
          tempToken,
        }),
      )

      toast.success('Complete two-factor challenge')
      router.replace(`/${locale}/auth/2fa/challenge`)
      return
    }

    if (!accessToken) {
      toast.error('OAuth callback did not return an access token')
      return
    }

    const user: UserProfile = {
      id: searchParams.get('id') ?? 'oauth-user',
      email: searchParams.get('email') ?? '',
      firstName: searchParams.get('firstName') ?? 'User',
      lastName: searchParams.get('lastName') ?? '',
      provider:
        (searchParams.get('provider') as UserProfile['provider']) ?? 'google',
    }

    persistSession({ accessToken, refreshToken: refreshToken ?? undefined })
    dispatch(
      setAuthenticatedSession({
        token: accessToken,
        user,
      }),
    )

    toast.success('OAuth login successful')
    router.replace(`/${locale}/dashboard`)
  }, [dispatch, locale, router, searchParams])

  return (
    <AuthCard title="OAuth callback" subtitle="Finalizing your session...">
      <p className="text-sm text-muted-foreground">
        Please wait while we complete authentication.
      </p>
    </AuthCard>
  )
}
