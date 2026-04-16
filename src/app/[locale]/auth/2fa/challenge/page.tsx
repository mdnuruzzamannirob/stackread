'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/authCard'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRequireTempToken } from '@/lib/auth/guards'
import { extractSession } from '@/lib/auth/normalize-auth'
import { resolveAuthenticatedDestination } from '@/lib/auth/onboarding'
import { clearPersistedTempToken } from '@/lib/auth/temp-token'
import { persistSession } from '@/lib/auth/token-storage'
import {
  useChallengeTwoFactorMutation,
  useSendTwoFactorEmailOtpMutation,
} from '@/store/features/auth/authApi'
import {
  clearTempToken,
  setAuthenticatedSession,
} from '@/store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

type ChallengeMethod = 'authenticator' | 'email' | 'backup'

export default function TwoFactorChallengePage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const dispatch = useAppDispatch()
  useRequireTempToken(locale)

  const tempToken = useAppSelector((state) => state.auth.tempToken)
  const [method, setMethod] = useState<ChallengeMethod>('authenticator')
  const [authenticatorOtp, setAuthenticatorOtp] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [emailCooldown, setEmailCooldown] = useState(0)

  const [challengeTwoFactor, { isLoading }] = useChallengeTwoFactorMutation()
  const [sendEmailOtp, { isLoading: isSending }] =
    useSendTwoFactorEmailOtpMutation()

  useEffect(() => {
    if (emailCooldown <= 0) {
      return
    }

    const interval = window.setInterval(() => {
      setEmailCooldown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [emailCooldown])

  useEffect(() => {
    return () => {
      if (window.location.pathname.endsWith('/auth/2fa/challenge')) {
        clearPersistedTempToken()
        dispatch(clearTempToken())
      }
    }
  }, [dispatch])

  const getActiveValue = () => {
    if (method === 'authenticator') {
      return authenticatorOtp.trim()
    }

    if (method === 'email') {
      return emailOtp.trim()
    }

    return backupCode.trim()
  }

  const getChallengePayload = () => {
    const value = getActiveValue()

    if (method === 'backup') {
      return { backupCode: value }
    }

    if (!/^\d{6}$/.test(value)) {
      throw new Error(
        method === 'email'
          ? 'Email OTP must be 6 digits.'
          : 'Authenticator OTP must be 6 digits.',
      )
    }

    return method === 'email' ? { emailOtp: value } : { otp: value }
  }

  const onSendOtp = async () => {
    if (!tempToken) {
      toast.error('Missing temporary token')
      return
    }

    if (emailCooldown > 0) {
      return
    }

    try {
      await sendEmailOtp({ tempToken }).unwrap()
      setEmailCooldown(60)
      toast.success('OTP sent to your email')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to send OTP'))
    }
  }

  const onSubmit = async () => {
    if (!tempToken) {
      toast.error('Missing temporary token')
      return
    }

    setSubmitError(null)

    try {
      const challengePayload = getChallengePayload()
      const response = await challengeTwoFactor({
        tempToken,
        ...challengePayload,
      }).unwrap()
      const session = extractSession(response.data)

      if (!session) {
        toast.error('Invalid challenge response')
        return
      }

      persistSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
      clearPersistedTempToken()
      dispatch(clearTempToken())

      dispatch(
        setAuthenticatedSession({
          token: session.accessToken,
          user: session.user,
        }),
      )

      toast.success('Two-factor challenge passed')
      const destination = await resolveAuthenticatedDestination({
        accessToken: session.accessToken,
        locale,
      })
      router.push(destination)
    } catch (error) {
      if (error instanceof Error && error.message.includes('digits')) {
        setSubmitError(error.message)
        return
      }

      setSubmitError(getApiErrorMessage(error, 'Challenge failed'))
    }
  }

  const onBackToLogin = () => {
    clearPersistedTempToken()
    dispatch(clearTempToken())
    router.replace(`/${locale}/auth/login`)
  }

  return (
    <AuthCard
      title="Verify with 2FA"
      subtitle="Choose a method to complete sign-in."
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={method === 'authenticator' ? 'default' : 'outline'}
            onClick={() => setMethod('authenticator')}
          >
            Authenticator
          </Button>
          <Button
            type="button"
            variant={method === 'email' ? 'default' : 'outline'}
            onClick={() => setMethod('email')}
          >
            Email OTP
          </Button>
          <Button
            type="button"
            variant={method === 'backup' ? 'default' : 'outline'}
            onClick={() => setMethod('backup')}
          >
            Backup Code
          </Button>
        </div>

        {method === 'authenticator' ? (
          <input
            value={authenticatorOtp}
            onChange={(event) => {
              setAuthenticatorOtp(event.target.value)
              if (submitError) {
                setSubmitError(null)
              }
            }}
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            placeholder="6-digit authenticator code"
          />
        ) : null}

        {method === 'email' ? (
          <div className="space-y-2">
            <input
              value={emailOtp}
              onChange={(event) => {
                setEmailOtp(event.target.value)
                if (submitError) {
                  setSubmitError(null)
                }
              }}
              className="h-10 w-full rounded-lg border border-input px-3 text-sm"
              placeholder="6-digit email OTP"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onSendOtp}
              disabled={isSending || emailCooldown > 0}
            >
              {isSending
                ? 'Sending...'
                : emailCooldown > 0
                  ? `Resend in ${emailCooldown}s`
                  : 'Send OTP'}
            </Button>
          </div>
        ) : null}

        {method === 'backup' ? (
          <input
            value={backupCode}
            onChange={(event) => {
              setBackupCode(event.target.value)
              if (submitError) {
                setSubmitError(null)
              }
            }}
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            placeholder="Enter backup code"
          />
        ) : null}

        {submitError ? (
          <p className="text-xs text-destructive">{submitError}</p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify and continue'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBackToLogin}
        >
          Back to login
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Trouble signing in?{' '}
          <Link
            href={`/${locale}/auth/login`}
            className="text-primary underline-offset-4 hover:underline"
          >
            Return to login
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
