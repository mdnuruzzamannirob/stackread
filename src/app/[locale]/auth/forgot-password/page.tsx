'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useForgotPasswordMutation } from '@/store/features/auth/authApi'

export default function ForgotPasswordPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const onSubmit = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      toast.success('Reset OTP sent')
      router.push(
        `/${locale}/auth/reset-password?email=${encodeURIComponent(email)}`,
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
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          placeholder="Email address"
        />
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
