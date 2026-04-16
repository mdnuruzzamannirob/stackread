'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/authCard'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import {
  useResendResetOtpMutation,
  useVerifyResetOtpMutation,
} from '@/store/features/auth/authApi'

function getCooldownLabel(seconds: number) {
  return seconds > 0 ? `Resend in ${seconds}s` : 'Resend OTP'
}

export default function VerifyOtpPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  useRedirectAuthenticated(locale)

  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [otp, setOtp] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const [resendResetOtp, { isLoading: isResending }] =
    useResendResetOtpMutation()
  const [verifyResetOtp, { isLoading: isVerifying }] =
    useVerifyResetOtpMutation()

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

  const normalizedOtp = useMemo(() => otp.replace(/\D/g, '').slice(0, 6), [otp])

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required.')
      return false
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!valid) {
      setEmailError('Enter a valid email address.')
      return false
    }

    setEmailError(null)
    return true
  }

  const validateOtp = () => {
    if (!/^\d{6}$/.test(normalizedOtp)) {
      setOtpError('OTP must be 6 digits.')
      return false
    }

    setOtpError(null)
    return true
  }

  const onResend = async () => {
    if (cooldown > 0) {
      return
    }

    if (!validateEmail()) {
      return
    }

    try {
      await resendResetOtp({ email: email.trim() }).unwrap()
      setCooldown(60)
      toast.success('Reset OTP resent.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not resend reset OTP.'))
    }
  }

  const onVerify = async () => {
    if (!validateEmail() || !validateOtp()) {
      return
    }

    try {
      const response = await verifyResetOtp({
        email: email.trim(),
        otp: normalizedOtp,
      }).unwrap()

      const resetToken = response.data?.resetToken

      if (!resetToken) {
        toast.error('Reset token missing in response.')
        return
      }

      toast.success('OTP verified.')
      router.push(
        `/${locale}/auth/reset-password?resetToken=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email.trim())}`,
      )
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Invalid or expired OTP.'))
    }
  }

  return (
    <AuthCard
      title="Verify reset OTP"
      subtitle="Enter the 6-digit code sent to your email."
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

        <input
          value={normalizedOtp}
          onChange={(event) => {
            setOtp(event.target.value)
            if (otpError) {
              setOtpError(null)
            }
          }}
          inputMode="numeric"
          className="h-10 w-full rounded-lg border border-input px-3 text-center text-sm tracking-[0.35em]"
          placeholder="000000"
        />
        {otpError ? (
          <p className="text-xs text-destructive">{otpError}</p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={onVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onResend}
          disabled={isResending || cooldown > 0}
        >
          {isResending ? 'Sending...' : getCooldownLabel(cooldown)}
        </Button>
      </div>
    </AuthCard>
  )
}
