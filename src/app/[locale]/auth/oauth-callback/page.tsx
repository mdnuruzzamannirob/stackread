'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { parseOAuthCallbackParams } from '@/lib/auth/normalize-auth'
import { persistSession } from '@/lib/auth/token-storage'
import {
  setAuthenticatedSession,
  setLoginOutcome,
} from '@/store/features/auth/authSlice'
import { useAppDispatch } from '@/store/hooks'

export default function OAuthCallbackPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const { accessToken, refreshToken, tempToken, requiresTwoFactor, user } =
      parseOAuthCallbackParams(searchParams)

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

    persistSession({ accessToken, refreshToken: refreshToken ?? undefined })
    const resolvedUser = user ?? {
      id: 'oauth-user',
      email: '',
      firstName: 'User',
      provider: 'google' as const,
    }

    dispatch(
      setAuthenticatedSession({
        token: accessToken,
        user: resolvedUser,
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
