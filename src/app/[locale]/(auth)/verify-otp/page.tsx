'use client'

import OtpInputField from '@/components/OtpInputField'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const RESEND_SECONDS = 30

const VerifyOTPPage = () => {
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

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="flex flex-1 min-h-dvh">
        <section className="fixed left-0 top-0 min-h-dvh w-1/2 bg-red-50">
          Left
        </section>

        <section className="ml-[50%] flex min-h-dvh w-1/2 items-center justify-center overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-lg rounded-xl px-4 py-16 sm:px-6">
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold sm:text-3xl">Verify OTP</h1>
              <p className="text-slate-500">
                Enter the 6-digit code we sent to your email address to reset
                your password.
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                console.log('OTP submitted:', otp)
              }}
            >
              <div className="mb-5">
                <OtpInputField
                  length={6}
                  onChange={setOtp}
                  onComplete={(value) => console.log('OTP complete:', value)}
                />
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-lg bg-teal-700 text-sm font-medium text-white transition-all duration-150 hover:bg-teal-800 active:scale-[0.99]"
              >
                Verify Code
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                {secondsLeft > 0 ? (
                  <span>Resend available in {secondsLeft}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSecondsLeft(RESEND_SECONDS)
                    }}
                    className="font-medium text-teal-700 hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                Wrong email?{' '}
                <Link
                  href="/forgot-password"
                  className="font-medium text-teal-700 hover:underline"
                >
                  Go back
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default VerifyOTPPage
