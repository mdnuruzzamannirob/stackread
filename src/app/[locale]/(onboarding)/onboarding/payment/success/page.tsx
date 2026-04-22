'use client'

import { getApiErrorMessage } from '@/lib/api/error-message'
import { onboardingApi } from '@/store/features/onboarding/onboardingApi'
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type VerificationState = 'loading' | 'confirmed' | 'failed'

type SummaryItem = {
  label: string
  value: string
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current" />
    </span>
  )
}

export default function OnboardingPaymentSuccessPage() {
  const params = useParams<{ locale: string }>()
  const locale = (params?.locale === 'bn' ? 'bn' : 'en') as 'en' | 'bn'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationState, setVerificationState] =
    useState<VerificationState>('loading')
  const [loadingMessage, setLoadingMessage] = useState('Verifying payment')
  const [countdown, setCountdown] = useState(5)

  const [confirmPayment] = onboardingApi.useConfirmOnboardingPaymentMutation()

  const sessionId =
    searchParams.get('session_id') ?? searchParams.get('sessionId') ?? ''
  const reference = searchParams.get('reference') ?? undefined
  const planId = searchParams.get('plan_id') ?? 'FREE'
  const planName = searchParams.get('plan_name') ?? 'Plan'
  const billingCycle = searchParams.get('billing_cycle') ?? 'monthly'
  const price = searchParams.get('price') ?? '0.00'
  const currency = searchParams.get('currency') ?? 'USD'
  const cardLast4 = searchParams.get('card_last4') ?? '4242'

  const nextBillingDate = useMemo(() => {
    const now = new Date()
    if (billingCycle === 'yearly') {
      now.setFullYear(now.getFullYear() + 1)
    } else {
      now.setMonth(now.getMonth() + 1)
    }

    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [billingCycle])

  const summary = useMemo<SummaryItem[]>(
    () => [
      { label: 'Plan', value: planName },
      { label: 'Plan code', value: planId },
      {
        label: 'Billing cycle',
        value: billingCycle === 'yearly' ? 'Annually' : 'Monthly',
      },
      { label: 'Amount', value: `${currency} ${price}` },
      { label: 'Next billing', value: nextBillingDate },
      { label: 'Card', value: `•••• ${cardLast4}` },
    ],
    [billingCycle, cardLast4, currency, nextBillingDate, planId, planName, price],
  )

  const verifyPayment = useCallback(async () => {
    try {
      setLoadingMessage('Verifying payment')

      if (sessionId) {
        await confirmPayment({ sessionId, reference }).unwrap()
      }

      setVerificationState('confirmed')
      setCountdown(5)
    } catch (error) {
      setVerificationState('failed')
      toast.error(
        getApiErrorMessage(error, 'Unable to confirm payment right now.'),
      )
    }
  }, [confirmPayment, reference, sessionId])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      if (!cancelled) {
        await verifyPayment()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [verifyPayment])

  useEffect(() => {
    if (verificationState !== 'confirmed') {
      return
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          router.push(`/${locale}/onboarding/complete`)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [locale, router, verificationState])

  const handleContinue = () => {
    router.push(`/${locale}/onboarding/complete`)
  }

  const handleRetryVerification = () => {
    setVerificationState('loading')
    setLoadingMessage('Retrying payment confirmation')
    void verifyPayment()
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center">
        {verificationState === 'loading' ? (
          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-teal-50 mb-6">
              <Loader2 className="size-6 animate-spin text-teal-700" />
            </div>
            <h1 className="text-[22px] font-semibold text-slate-900 mb-2">
              {loadingMessage}
            </h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Please wait while we verify your payment and activate your plan{' '}
              <LoadingDots />
            </p>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {summary.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : verificationState === 'failed' ? (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-red-50 mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M7 7l14 14M21 7L7 21"
                  stroke="#A32D2D"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="text-[22px] font-semibold text-slate-900 mb-2">
              Payment verification failed
            </h1>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              We could not verify this checkout session yet. If Stripe has
              already captured the payment, retry verification after a moment.
            </p>

            <div className="border border-red-100 rounded-3xl p-5 text-left mb-4 bg-white shadow-sm animate-in slide-in-from-bottom-2 duration-500 delay-75">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-red-700 mb-3.5">
                Overview
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {summary.map((row) => (
                  <div key={row.label} className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                      {row.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end animate-in slide-in-from-bottom-2 duration-500 delay-150">
              <button
                type="button"
                onClick={handleRetryVerification}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-700"
              >
                <RefreshCw className="size-4" />
                Retry verification
              </button>

              <button
                type="button"
                onClick={() => router.push(`/${locale}/onboarding/plan`)}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50"
              >
                Choose another plan
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-teal-50 mb-5">
              <CheckCircle2 className="size-7 text-teal-600" />
            </div>

            <h1 className="text-[22px] font-semibold text-slate-900 mb-2">
              Payment confirmed
            </h1>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Your subscription is active. Redirecting to completion in{' '}
              {countdown}s.
            </p>

            <div className="border border-gray-200 rounded-3xl p-5 text-left mb-4 bg-white shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-700 mb-3.5">
                Overview
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {summary.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-700"
              >
                Continue to complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
