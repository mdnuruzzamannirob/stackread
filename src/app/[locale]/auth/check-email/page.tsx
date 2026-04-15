'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import { useResendVerificationMutation } from '@/store/features/auth/authApi'

export default function CheckEmailPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const searchParams = useSearchParams()
  useRedirectAuthenticated(locale)
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [resendVerification, { isLoading }] = useResendVerificationMutation()

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

  const resend = async () => {
    if (cooldown > 0) {
      return
    }

    if (!email.trim()) {
      setEmailError('Email is required')
      toast.error('Email is required')
      return
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!validEmail) {
      setEmailError('Enter a valid email address')
      return
    }

    setEmailError(null)

    try {
      await resendVerification({ email }).unwrap()
      setCooldown(60)
      toast.success('Verification email resent')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to resend verification'))
    }
  }

  return (
    <AuthCard
      title="Check your inbox"
      subtitle="If you did not receive the email, send again."
    >
      <div className="space-y-3">
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
          className="w-full"
          onClick={resend}
          disabled={isLoading || cooldown > 0}
        >
          {isLoading
            ? 'Sending...'
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend verification'}
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Locale: {locale.toUpperCase()}
      </p>
      <p className="mt-2 text-sm">
        Already got a token?{' '}
        <Link
          href={`/${locale}/auth/verify-email`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Verify email now
        </Link>
      </p>
    </AuthCard>
  )
}
