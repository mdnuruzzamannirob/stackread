'use client'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/authCard'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import { useResetPasswordMutation } from '@/store/features/auth/authApi'

export default function ResetPasswordPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  useRedirectAuthenticated(locale)
  const searchParams = useSearchParams()
  const resetToken = searchParams.get('resetToken') ?? ''
  const email = searchParams.get('email') ?? ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const getPasswordStrength = (value: string) => {
    let score = 0

    if (value.length >= 8) score += 1
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
    if (/\d/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1

    if (score <= 1) return { label: 'Weak', width: '25%' }
    if (score === 2) return { label: 'Fair', width: '50%' }
    if (score === 3) return { label: 'Good', width: '75%' }

    return { label: 'Strong', width: '100%' }
  }

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return false
    }

    setPasswordError(null)
    return true
  }

  const onResetPassword = async () => {
    if (!resetToken) {
      toast.error('Your reset session is missing. Verify OTP again.')
      return
    }

    if (!validatePassword()) {
      return
    }

    try {
      await resetPassword({ resetToken, newPassword }).unwrap()
      toast.success(
        'Password reset complete. You have been signed out on other devices.',
      )
      router.replace(`/${locale}/auth/login?reset=1`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Password reset failed'))
    }
  }

  const strength = getPasswordStrength(newPassword)

  return (
    <AuthCard
      title="Reset password"
      subtitle="Set your new password to finish account recovery."
    >
      <div className="space-y-3">
        {email ? (
          <p className="text-xs text-muted-foreground">
            Resetting password for {email}
          </p>
        ) : null}

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

        <div className="space-y-1">
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: strength.width }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Strength: {strength.label}
          </p>
        </div>

        <input
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            if (passwordError) {
              setPasswordError(null)
            }
          }}
          className="h-10 w-full rounded-lg border border-input px-3 text-sm"
          type="password"
          placeholder="Confirm new password"
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

        {!resetToken ? (
          <p className="text-xs text-muted-foreground">
            Missing reset token.{' '}
            <Link
              href={`/${locale}/auth/verify-otp${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Verify OTP again
            </Link>
          </p>
        ) : null}
      </div>
    </AuthCard>
  )
}
