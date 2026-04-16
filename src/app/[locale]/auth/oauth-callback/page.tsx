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
import { persistSession } from '@/lib/auth/token-storage'
import { setLoginOutcome } from '@/store/features/auth/authSlice'
import { useAppDispatch } from '@/store/hooks'

export default function OAuthCallbackPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

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

    clearPersistedTempToken()

    void (async () => {
      try {
        if (accessToken) {
          persistSession({
            accessToken,
            refreshToken: refreshToken ?? undefined,
          })
        }

        toast.success('OAuth login successful')

        const destination = await resolveAuthenticatedDestination({
          locale,
        })

        router.replace(destination)
      } catch {
        toast.error('Unable to finalize OAuth session')
        router.replace(`/${locale}/auth/login`)
      }
    })()
  }, [dispatch, locale, router, searchParams])

  return (
    <AuthCard title="OAuth callback" subtitle="Finalizing your session...">
      <p className="text-sm text-muted-foreground">
        Please wait while we complete authentication.
      </p>
    </AuthCard>
  )
}
