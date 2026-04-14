'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import { useVerifyEmailMutation } from '@/store/features/auth/authApi'

export default function VerifyEmailPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  useRedirectAuthenticated(locale)
  const searchParams = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation()

  const onVerify = async () => {
    if (!token.trim()) {
      setTokenError('Verification token is required')
      toast.error('Verification token is required')
      return
    }

    setTokenError(null)

    try {
      await verifyEmail({ token }).unwrap()
      toast.success('Email verified')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not verify email'))
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
          onClick={onVerify}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify email'}
        </Button>
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
