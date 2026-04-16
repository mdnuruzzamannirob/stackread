'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useConfirmStripeCheckoutSessionMutation } from '@/store/features/subscriptions/subscriptionsApi'

export default function PaymentSuccessRedirectPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasStartedRef = useRef(false)
  const [statusText, setStatusText] = useState('Finalizing payment...')
  const [isFinalizing, setIsFinalizing] = useState(true)
  const [confirmStripeCheckoutSession] =
    useConfirmStripeCheckoutSessionMutation()

  const paymentReference = searchParams.get('ref')
  const stripeSessionId = searchParams.get('session_id')

  const onboardingSuccessUrl = useMemo(() => {
    const query = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      query.append(key, value)
    }

    const suffix = query.toString() ? `?${query.toString()}` : ''
    return `/${locale}/onboarding/success${suffix}`
  }, [locale, searchParams])

  useEffect(() => {
    if (hasStartedRef.current) {
      return
    }

    hasStartedRef.current = true

    const run = async () => {
      if (!stripeSessionId) {
        router.replace(onboardingSuccessUrl)
        return
      }

      try {
        await confirmStripeCheckoutSession({
          sessionId: stripeSessionId,
          ...(paymentReference ? { reference: paymentReference } : {}),
        }).unwrap()

        setStatusText('Payment confirmed. Redirecting to your dashboard...')
        router.replace(`/${locale}/dashboard#subscription-management`)
      } catch (error) {
        setIsFinalizing(false)
        setStatusText('Payment confirmation is taking longer than expected.')
        toast.error(
          getApiErrorMessage(error, 'Unable to confirm payment right now.'),
        )
      }
    }

    void run()
  }, [
    confirmStripeCheckoutSession,
    locale,
    onboardingSuccessUrl,
    paymentReference,
    router,
    stripeSessionId,
  ])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-8">
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">
          Payment success
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{statusText}</p>
        {!isFinalizing ? (
          <Button
            type="button"
            className="mt-4 w-full"
            onClick={() =>
              router.replace(`/${locale}/dashboard#subscription-management`)
            }
          >
            Return to dashboard
          </Button>
        ) : null}
      </div>
    </main>
  )
}
