'use client'

import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { onboardingApi } from '@/store/features/onboarding/onboardingApi'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function OnboardingPaymentSuccessPage() {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [confirmed, setConfirmed] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const [confirmPayment, { isLoading }] =
    onboardingApi.useConfirmOnboardingPaymentMutation()

  const sessionId =
    searchParams.get('session_id') ?? searchParams.get('sessionId') ?? ''
  const reference = searchParams.get('reference') ?? undefined
  const planId = searchParams.get('plan_id') ?? 'FREE'
  const planName = searchParams.get('plan_name') ?? 'Plan'
  const billingCycle = searchParams.get('billing_cycle') ?? 'monthly'
  const price = searchParams.get('price') ?? '0.00'
  const currency = searchParams.get('currency') ?? 'USD'
  const cardLast4 = searchParams.get('card_last4') ?? '4242'

  const summary = useMemo(() => {
    return [
      { label: 'Plan', value: planName },
      { label: 'Plan code', value: planId },
      { label: 'Billing cycle', value: billingCycle },
      { label: 'Amount', value: `${currency} ${price}` },
      { label: 'Card', value: `•••• ${cardLast4}` },
    ]
  }, [billingCycle, cardLast4, currency, planId, planName, price])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        if (sessionId) {
          await confirmPayment({ sessionId, reference }).unwrap()
        }
        if (!cancelled) {
          setConfirmed(true)
        }
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, 'Unable to confirm payment right now.'),
        )
      }
    })()

    return () => {
      cancelled = true
    }
  }, [confirmPayment, reference, sessionId])

  useEffect(() => {
    if (!confirmed) {
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
  }, [confirmed, locale, router])

  const handleContinue = () => {
    router.push(`/${locale}/onboarding/complete`)
  }

  return (
    <OnboardingShell
      stepLabel="Step 4 of 5"
      progress={4}
      title={confirmed ? 'Payment confirmed' : 'Confirming your payment'}
      subtitle={
        confirmed
          ? 'Your subscription is ready. Review the summary below.'
          : 'Please wait while we verify your payment with the backend.'
      }
    >
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          {confirmed ? (
            <CheckCircle2 className="size-7 text-teal-600" />
          ) : (
            <Loader2 className="size-7 animate-spin text-teal-600" />
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {confirmed ? 'Subscription active' : 'Verifying payment'}
            </p>
            <p className="text-sm text-gray-500">
              {confirmed
                ? `Auto-redirecting in ${countdown}s`
                : 'This usually takes a few seconds.'}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Continue
          </button>
        </div>
      </div>
    </OnboardingShell>
  )
}
