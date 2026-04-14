'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useResendVerificationMutation } from '@/store/features/auth/authApi'

export default function CheckEmailPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [resendVerification, { isLoading }] = useResendVerificationMutation()

  const resend = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

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
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          placeholder="Email address"
        />
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
