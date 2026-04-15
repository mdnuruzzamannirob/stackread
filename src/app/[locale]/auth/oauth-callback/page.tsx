'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { parseOAuthCallbackParams } from '@/lib/auth/normalize-auth'
import { resolveAuthenticatedDestination } from '@/lib/auth/onboarding'
import {
  clearPersistedTempToken,
  persistTempToken,
} from '@/lib/auth/temp-token'
import { getStoredAccessToken, persistSession } from '@/lib/auth/token-storage'
import { useLazyMeQuery } from '@/store/features/auth/authApi'
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
  const [loadMe] = useLazyMeQuery()

  useEffect(() => {
    const { accessToken, refreshToken, tempToken, requiresTwoFactor, error } =
      parseOAuthCallbackParams(searchParams)

    if (error) {
      toast.error(error)
      router.replace(`/${locale}/auth/login?error=${encodeURIComponent(error)}`)
      return
    }

    if (requiresTwoFactor && tempToken) {
      persistTempToken(tempToken)
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

    if (accessToken) {
      persistSession({
        accessToken,
        refreshToken: refreshToken ?? undefined,
      })
    }

    clearPersistedTempToken()

    void (async () => {
      try {
        const meResponse = await loadMe().unwrap()
        const storedToken = getStoredAccessToken()

        dispatch(
          setAuthenticatedSession({
            token: storedToken,
            user: meResponse.data,
          }),
        )

        toast.success('OAuth login successful')

        const destination = await resolveAuthenticatedDestination({
          accessToken: storedToken,
          locale,
        })

        router.replace(destination)
      } catch {
        toast.error('Unable to finalize OAuth session')
        router.replace(`/${locale}/auth/login`)
      }
    })()
  }, [dispatch, loadMe, locale, router, searchParams])

  return (
    <AuthCard title="OAuth callback" subtitle="Finalizing your session...">
      <p className="text-sm text-muted-foreground">
        Please wait while we complete authentication.
      </p>
    </AuthCard>
  )
}
