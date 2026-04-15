'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import { useForgotPasswordMutation } from '@/store/features/auth/authApi'

export default function ForgotPasswordPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  useRedirectAuthenticated(locale)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const onSubmit = async () => {
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
      await forgotPassword({ email }).unwrap()
      toast.success('Reset OTP sent')
      router.push(
        `/${locale}/auth/verify-otp?email=${encodeURIComponent(email)}`,
      )
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not send reset OTP'))
    }
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="We will send a reset OTP to your email."
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
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send reset OTP'}
        </Button>
      </div>
    </AuthCard>
  )
}
