'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useResendResetOtpMutation,
  useResetPasswordMutation,
  useVerifyResetOtpMutation,
} from '@/store/features/auth/authApi'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetToken, setResetToken] = useState('')

  const [resendResetOtp, { isLoading: isResending }] =
    useResendResetOtpMutation()
  const [verifyResetOtp, { isLoading: isVerifying }] =
    useVerifyResetOtpMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const onResendOtp = async () => {
    try {
      await resendResetOtp({ email }).unwrap()
      toast.success('Reset OTP resent')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not resend OTP'))
    }
  }

  const onVerifyOtp = async () => {
    try {
      const response = await verifyResetOtp({ email, otp }).unwrap()
      const token = (response.data as { resetToken?: string }).resetToken

      if (!token) {
        toast.error('Reset token missing in response')
        return
      }

      setResetToken(token)
      toast.success('OTP verified')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'OTP verification failed'))
    }
  }

  const onResetPassword = async () => {
    if (!resetToken) {
      toast.error('Verify OTP first')
      return
    }

    try {
      await resetPassword({ resetToken, newPassword }).unwrap()
      toast.success('Password reset complete')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Password reset failed'))
    }
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Verify OTP, then set a new password."
    >
      <div className="space-y-3">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          type="email"
          placeholder="Email address"
        />

        <div className="flex gap-2">
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            placeholder="6-digit OTP"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onVerifyOtp}
            disabled={isVerifying}
          >
            Verify OTP
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onResendOtp}
          disabled={isResending}
        >
          Resend OTP
        </Button>

        <input
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          type="password"
          placeholder="New password"
        />

        <Button
          type="button"
          className="w-full"
          onClick={onResetPassword}
          disabled={isResetting}
        >
          {isResetting ? 'Resetting...' : 'Reset password'}
        </Button>
      </div>
    </AuthCard>
  )
}
