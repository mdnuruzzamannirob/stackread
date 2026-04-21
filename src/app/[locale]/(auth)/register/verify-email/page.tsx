'use client'

import AuthShell from '@/components/AuthShell'
import OtpInputField from '@/components/OtpInputField'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from '@/store/features/auth/authApi'
import { useAppSelector } from '@/store/hooks'

const RESEND_SECONDS = 60

const VerifyEmailPage = () => {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const emailInFlow = useAppSelector((state) => state.auth.emailInFlow)

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation()

  const [otp, setOtp] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!emailInFlow || !otp) {
      toast.error('Please enter the verification code')
      return
    }

    try {
      await verifyEmail({
        email: emailInFlow,
        otp,
      }).unwrap()

      toast.success('Email verified successfully!')
      router.push(`/${locale}/onboarding/welcome`)
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'Verification failed. Please check the code and try again.',
      )
      toast.error(errorMessage)
    }
  }

  const handleResend = async () => {
    if (!emailInFlow) {
      toast.error('Email not found. Please try registering again.')
      return
    }

    try {
      await resendVerification({ email: emailInFlow }).unwrap()
      setSecondsLeft(RESEND_SECONDS)
      setOtp('')
      toast.success('Code resent to your email')
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'Failed to resend code. Please try again.',
      )
      toast.error(errorMessage)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="flex flex-1 min-h-dvh">
        <AuthShell
          backgroundImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=1600&fit=crop"
          title="Verify your email."
          description="Confirm your email address to activate your StackRead account."
        />

        {/* Right */}
        <section className="w-full lg:w-1/2 lg:ml-[50%] min-h-dvh flex flex-col bg-white overflow-y-auto">
          <div className="flex flex-1 items-center justify-center">
            <div className="mx-auto w-full max-w-lg rounded-xl px-4 py-16 sm:px-6">
              <div className="mb-8 space-y-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  Verify Your Email
                </h1>
                <p className="text-slate-500">
                  Enter the 6-digit code we sent to{' '}
                  <span className="font-medium text-gray-900">
                    {emailInFlow}
                  </span>
                  .
                </p>
              </div>

              <form onSubmit={handleVerify}>
                <div className="mb-5">
                  <OtpInputField
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isVerifying}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otp.length !== 6}
                  className="h-12 w-full rounded-lg bg-teal-700 text-sm font-medium text-white transition-all duration-150 hover:bg-teal-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  {secondsLeft > 0 ? (
                    <span>Resend available in {secondsLeft}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="font-medium text-teal-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResending ? 'Sending...' : 'Resend code'}
                    </button>
                  )}
                </div>

                <p className="mt-4 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link
                    href={`/${locale}/login`}
                    className="font-medium text-teal-700 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </form>
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

export default VerifyEmailPage
