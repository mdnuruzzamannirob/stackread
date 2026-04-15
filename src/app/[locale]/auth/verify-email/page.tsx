'use client'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { resolveAuthenticatedDestination } from '@/lib/auth/onboarding'
import { getStoredAccessToken } from '@/lib/auth/token-storage'
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from '@/store/features/auth/authApi'

export default function VerifyEmailPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const didAutoSubmitRef = useRef(false)
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation()
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation()

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const interval = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1))
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [cooldown])

  const handleSuccessRedirect = async () => {
    const accessToken = getStoredAccessToken()

    if (accessToken) {
      const destination = await resolveAuthenticatedDestination({
        accessToken,
        locale,
      })
      router.replace(destination)
      return
    }

    router.replace(`/${locale}/auth/login?verified=1`)
  }

  const onVerify = async (tokenInput?: string) => {
    const finalToken = tokenInput ?? token

    if (!finalToken.trim()) {
      setTokenError('Verification token is required.')
      return
    }

    setTokenError(null)

    try {
      await verifyEmail({ token: finalToken.trim() }).unwrap()
      toast.success('Email verified successfully.')
      await handleSuccessRedirect()
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Could not verify email. The token may be expired or invalid.',
      )
      setTokenError(message)
      toast.error(message)
    }
  }

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')

    if (!tokenFromUrl || didAutoSubmitRef.current) {
      return
    }

    didAutoSubmitRef.current = true
    void onVerify(tokenFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const onResend = async () => {
    if (cooldown > 0) {
      return
    }

    if (!email.trim()) {
      setEmailError('Email is required.')
      return
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!validEmail) {
      setEmailError('Enter a valid email address.')
      return
    }

    setEmailError(null)

    try {
      await resendVerification({ email: email.trim() }).unwrap()
      setCooldown(60)
      toast.success('Verification email sent.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not resend verification.'))
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle="Use the token from your verification email."
    >
      <div className="space-y-3">
        <input
          value={token}
          onChange={(event) => {
            setToken(event.target.value)
            if (tokenError) {
              setTokenError(null)
            }
          }}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          placeholder="Verification token"
        />
        {tokenError ? (
          <p className="text-xs text-destructive">{tokenError}</p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={() => void onVerify()}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify email'}
        </Button>

        <div className="space-y-2 rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">
            Need a fresh verification email?
          </p>
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (emailError) {
                setEmailError(null)
              }
            }}
            type="email"
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            placeholder="Email address"
          />
          {emailError ? (
            <p className="text-xs text-destructive">{emailError}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onResend}
            disabled={isResending || cooldown > 0}
          >
            {isResending
              ? 'Sending...'
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend verification email'}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-sm">
        Need another email?{' '}
        <Link
          className="text-primary underline-offset-4 hover:underline"
          href={`/${locale}/auth/check-email`}
        >
          Resend verification
        </Link>
      </p>
    </AuthCard>
  )
}
