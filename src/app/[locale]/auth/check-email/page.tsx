'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
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
  const [resendVerification, { isLoading }] = useResendVerificationMutation()

  const resend = async () => {
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
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Resend verification'}
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Locale: {locale.toUpperCase()}
      </p>
    </AuthCard>
  )
}
