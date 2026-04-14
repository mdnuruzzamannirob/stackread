'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { extractSession } from '@/lib/auth/normalize-auth'
import { persistSession } from '@/lib/auth/token-storage'
import {
  useChallengeTwoFactorMutation,
  useSendTwoFactorEmailOtpMutation,
} from '@/store/features/auth/authApi'
import { setAuthenticatedSession } from '@/store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function TwoFactorChallengePage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const dispatch = useAppDispatch()

  const tempToken = useAppSelector((state) => state.auth.tempToken)
  const [otp, setOtp] = useState('')

  const [challengeTwoFactor, { isLoading }] = useChallengeTwoFactorMutation()
  const [sendEmailOtp, { isLoading: isSending }] =
    useSendTwoFactorEmailOtpMutation()

  const onSendOtp = async () => {
    if (!tempToken) {
      toast.error('Missing temporary token')
      return
    }

    try {
      await sendEmailOtp({ tempToken }).unwrap()
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

    try {
      const response = await challengeTwoFactor({ tempToken, otp }).unwrap()
      const session = extractSession(response.data)

      if (!session) {
        toast.error('Invalid challenge response')
        return
      }

      persistSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
      dispatch(
        setAuthenticatedSession({
          token: session.accessToken,
          user: session.user,
        }),
      )

      toast.success('Two-factor challenge passed')
      router.push(`/${locale}/dashboard`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Challenge failed'))
    }
  }

  return (
    <AuthCard
      title="Two-factor challenge"
      subtitle="Enter the one-time code to continue."
    >
      <div className="space-y-3">
        <input
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          placeholder="6-digit OTP"
        />
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
          variant="outline"
          className="w-full"
          onClick={onSendOtp}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send OTP to email'}
        </Button>
      </div>
    </AuthCard>
  )
}
