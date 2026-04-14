'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import {
  useResendResetOtpMutation,
  useResetPasswordMutation,
  useVerifyResetOtpMutation,
} from '@/store/features/auth/authApi'

export default function ResetPasswordPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  useRedirectAuthenticated(locale)
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [resendResetOtp, { isLoading: isResending }] =
    useResendResetOtpMutation()
  const [verifyResetOtp, { isLoading: isVerifying }] =
    useVerifyResetOtpMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const hasValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }

    if (!hasValidEmail(email)) {
      setEmailError('Enter a valid email address')
      return false
    }

    setEmailError(null)
    return true
  }

  const validateOtp = () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('OTP must be 6 digits')
      return false
    }

    setOtpError(null)
    return true
  }

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }

    setPasswordError(null)
    return true
  }

  const onResendOtp = async () => {
    if (!validateEmail()) {
      return
    }

    try {
      await resendResetOtp({ email }).unwrap()
      toast.success('Reset OTP resent')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not resend OTP'))
    }
  }

  const onVerifyOtp = async () => {
    if (!validateEmail() || !validateOtp()) {
      return
    }

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

    if (!validatePassword()) {
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
          onChange={(event) => {
            setEmail(event.target.value)
            if (emailError) {
              setEmailError(null)
            }
          }}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          type="email"
          placeholder="Email address"
        />
        {emailError ? (
          <p className="text-xs text-destructive">{emailError}</p>
        ) : null}

        <div className="flex gap-2">
          <input
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value)
              if (otpError) {
                setOtpError(null)
              }
            }}
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
        {otpError ? (
          <p className="text-xs text-destructive">{otpError}</p>
        ) : null}

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
          onChange={(event) => {
            setNewPassword(event.target.value)
            if (passwordError) {
              setPasswordError(null)
            }
          }}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          type="password"
          placeholder="New password"
        />
        {passwordError ? (
          <p className="text-xs text-destructive">{passwordError}</p>
        ) : null}

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
