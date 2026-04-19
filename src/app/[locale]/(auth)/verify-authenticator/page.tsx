'use client'

import OtpInputField from '@/components/OtpInputField'
import Link from 'next/link'
import { useState } from 'react'
import AuthHeroSection from '../../../../components/auth/AuthHeroSection'

const VerifyAuthenticatorPage = () => {
  const [otp, setOtp] = useState('')

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="flex flex-1 min-h-dvh">
        <AuthHeroSection
          backgroundImage="https://images.unsplash.com/photo-1614064641938-3bbee52b8d25?w=1200&h=1600&fit=crop"
          backgroundColor="bg-teal-700"
          title="Secure Your Knowledge"
          description="One more step to protect your digital archive."
        />

        <section className="ml-[50%] flex min-h-dvh w-1/2 items-center justify-center overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-lg rounded-xl px-4 py-16 sm:px-6">
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Verify with Authenticator
              </h1>
              <p className="text-slate-500">
                Enter the 6-digit code from your authenticator app to continue.
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                console.log('Authenticator OTP submitted:', otp)
              }}
            >
              <div className="mb-5">
                <OtpInputField
                  length={6}
                  onChange={setOtp}
                  onComplete={(value) =>
                    console.log('Authenticator OTP complete:', value)
                  }
                />
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-lg bg-teal-700 text-sm font-medium text-white transition-all duration-150 hover:bg-teal-800 active:scale-[0.99]"
              >
                Verify & Continue
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Can&apos;t access your authenticator?{' '}
                <Link
                  href="/choose-verification"
                  className="font-medium text-teal-700 hover:underline"
                >
                  Try another method
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default VerifyAuthenticatorPage
