'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useVerifyEmailMutation } from '@/store/features/auth/authApi'

export default function VerifyEmailPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const searchParams = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation()

  const onVerify = async () => {
    if (!token) {
      toast.error('Verification token is required')
      return
    }

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
          onChange={(event) => setToken(event.target.value)}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          placeholder="Verification token"
        />
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
