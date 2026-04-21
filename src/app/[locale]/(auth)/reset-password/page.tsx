'use client'

import AuthShell from '@/components/AuthShell'
import InputField from '@/components/InputField'
import OtpInputField from '@/components/OtpInputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useResetPasswordMutation,
  useVerifyResetOtpMutation,
} from '@/store/features/auth/authApi'
import { setResetToken } from '@/store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit code'),
})

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type OtpFormData = z.infer<typeof otpSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

const ResetPasswordPage = () => {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const dispatch = useAppDispatch()
  const emailInFlow = useAppSelector((state) => state.auth.emailInFlow)
  const resetToken = useAppSelector((state) => state.auth.resetToken)

  const [step, setStep] = useState<'otp' | 'password'>('otp')
  const [secondsLeft, setSecondsLeft] = useState(60)

  const [verifyResetOtp, { isLoading: isVerifying }] =
    useVerifyResetOtpMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onOtpSubmit = async (data: OtpFormData) => {
    if (!emailInFlow) {
      toast.error('Email not found. Please try forgot password again.')
      return
    }

    try {
      const response = await verifyResetOtp({
        email: emailInFlow,
        otp: data.otp,
      }).unwrap()

      if (response.data) {
        dispatch(setResetToken(response.data.resetToken))
        setStep('password')
        toast.success('OTP verified! Please enter your new password.')
      }
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'OTP verification failed. Please check and try again.',
      )
      toast.error(errorMessage)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!emailInFlow || !resetToken) {
      toast.error('Session expired. Please start over.')
      router.push(`/${locale}/forgot-password`)
      return
    }

    try {
      await resetPassword({
        email: emailInFlow,
        resetToken,
        newPassword: data.newPassword,
      }).unwrap()

      toast.success('Password reset successfully!')
      router.push(`/${locale}/login`)
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'Failed to reset password. Please try again.',
      )
      toast.error(errorMessage)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="flex flex-1 min-h-dvh">
        <AuthShell
          backgroundImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=1600&fit=crop"
          title="Secure your account."
          description="Create a strong new password to protect your StackRead library."
        />

        <section className="w-full lg:w-1/2 lg:ml-[50%] min-h-dvh flex flex-col bg-white overflow-y-auto">
          <div className="flex flex-1 items-center justify-center">
            <div className="mx-auto w-full max-w-lg rounded-xl px-4 py-16 sm:px-6">
              {step === 'otp' ? (
                <>
                  <div className="mb-8 space-y-2">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                      Verify Reset Code
                    </h1>
                    <p className="text-slate-500">
                      Enter the 6-digit code we sent to{' '}
                      <span className="font-medium text-gray-900">
                        {emailInFlow}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
                    <div className="mb-5">
                      <OtpInputField
                        length={6}
                        value={otpForm.watch('otp') || ''}
                        onChange={(value) =>
                          otpForm.setValue('otp', value, {
                            shouldValidate: true,
                          })
                        }
                        disabled={isVerifying}
                      />
                    </div>
                    {otpForm.formState.errors.otp && (
                      <p className="text-sm text-red-600 mb-4">
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="h-12 w-full rounded-lg bg-teal-700 text-sm font-medium text-white transition-all duration-150 hover:bg-teal-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Code'}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-500">
                      Didn't receive code?{' '}
                      <button
                        type="button"
                        className="font-medium text-teal-700 hover:underline"
                      >
                        Resend
                      </button>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-8 space-y-2">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                      Create New Password
                    </h1>
                    <p className="text-slate-500">
                      Choose a strong new password for your account.
                    </p>
                  </div>

                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <div className="mb-4">
                      <InputField
                        icon={<Lock size={17} />}
                        type="password"
                        label="New Password"
                        required
                        placeholder="••••••••"
                        {...passwordForm.register('newPassword')}
                        error={
                          passwordForm.formState.errors.newPassword?.message
                        }
                        disabled={isResetting}
                      />
                    </div>

                    <div className="mb-4">
                      <InputField
                        icon={<Lock size={17} />}
                        type="password"
                        label="Confirm Password"
                        required
                        placeholder="••••••••"
                        {...passwordForm.register('confirmPassword')}
                        error={
                          passwordForm.formState.errors.confirmPassword?.message
                        }
                        disabled={isResetting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isResetting}
                      className="h-12 w-full rounded-lg bg-teal-700 text-sm font-medium text-white transition-all duration-150 hover:bg-teal-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-500">
                      Remember your password?{' '}
                      <Link
                        href={`/${locale}/login`}
                        className="font-medium text-teal-700 hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
          <div className="px-6 pb-6 flex sm:flex-row flex-col-reverse items-center justify-between flex-wrap text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} StackRead. All rights reserved.
            </p>
            <div className="">
              <Link
                href="/support"
                className="font-medium text-teal-700 hover:underline"
              >
                Support
              </Link>{' '}
              |{' '}
              <Link
                href="/terms"
                className="font-medium text-teal-700 hover:underline"
              >
                Terms of Service
              </Link>{' '}
              |{' '}
              <Link
                href="/privacy"
                className="font-medium text-teal-700 hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ResetPasswordPage
