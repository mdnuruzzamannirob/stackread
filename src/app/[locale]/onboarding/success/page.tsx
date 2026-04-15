'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { getStoredAccessToken } from '@/lib/auth/token-storage'
import { env } from '@/lib/env'
import {
  useCompleteOnboardingMutation,
  useGetOnboardingStatusQuery,
} from '@/store/features/onboarding/onboardingApi'

export default function OnboardingSuccessPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [statusText, setStatusText] = useState(
    'Waiting for Stripe to confirm your payment...',
  )
  const [isFinalizing, setIsFinalizing] = useState(true)
  const hasCompletedRef = useRef(false)
  const hasStartedCompletionRef = useRef(false)
  const hasVerifiedPaymentRef = useRef(false)

  const paymentReference = searchParams.get('ref') ?? ''
  const stripeSessionId = searchParams.get('session_id') ?? ''

  const { data: statusResponse, refetch } = useGetOnboardingStatusQuery()
  const [completeOnboarding] = useCompleteOnboardingMutation()

  const fetchCurrentSubscriptionStatus = async () => {
    const accessToken = getStoredAccessToken()

    const response = await fetch(`${env.apiBaseUrl}/subscriptions/my`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as {
      data?: { status?: string }
    }

    return json.data?.status ?? null
  }

  const confirmStripePayment = useCallback(async () => {
    if (
      !paymentReference ||
      !stripeSessionId ||
      hasVerifiedPaymentRef.current
    ) {
      return false
    }

    const accessToken = getStoredAccessToken()

    const response = await fetch(`${env.apiBaseUrl}/payments/verify`, {
      method: 'POST',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        reference: paymentReference,
        providerPaymentId: stripeSessionId,
        status: 'success',
      }),
    })

    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as {
        message?: string
      } | null
      throw new Error(
        json?.message ?? 'Unable to confirm Stripe payment right now.',
      )
    }

    hasVerifiedPaymentRef.current = true
    return true
  }, [paymentReference, stripeSessionId])

  useEffect(() => {
    if (statusResponse?.data?.status === 'completed') {
      hasCompletedRef.current = true
      const timeout = window.setTimeout(() => {
        router.replace(`/${locale}/dashboard`)
      }, 1200)

      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [locale, router, statusResponse?.data?.status])

  useEffect(() => {
    if (hasCompletedRef.current) {
      return
    }

    let isMounted = true
    let attempts = 0
    const maxAttempts = 20

    const run = async () => {
      while (isMounted && attempts < maxAttempts && !hasCompletedRef.current) {
        attempts += 1
        setStatusText(
          `Checking payment confirmation... (${attempts}/${maxAttempts})`,
        )

        try {
          if (
            paymentReference &&
            stripeSessionId &&
            !hasVerifiedPaymentRef.current
          ) {
            setStatusText('Confirming payment with Stripe...')
            await confirmStripePayment()
          }

          const subscriptionStatus = await fetchCurrentSubscriptionStatus()

          if (subscriptionStatus !== 'active') {
            await new Promise((resolve) => {
              window.setTimeout(resolve, 3000)
            })
            continue
          }

          if (!hasStartedCompletionRef.current) {
            hasStartedCompletionRef.current = true
            setStatusText('Payment confirmed. Finalizing onboarding...')
            await completeOnboarding({ agreeToTerms: true }).unwrap()
          }

          await refetch()

          hasCompletedRef.current = true
          setStatusText('Onboarding completed. Redirecting to dashboard...')
          toast.success('Onboarding completed successfully.')
          router.replace(`/${locale}/dashboard`)
          return
        } catch (error) {
          if (attempts >= maxAttempts) {
            setStatusText(
              'Payment confirmation is taking longer than expected.',
            )
            toast.error(
              getApiErrorMessage(
                error,
                'We are still waiting for payment confirmation. Please try again in a moment.',
              ),
            )
            setIsFinalizing(false)
            return
          }
        }

        await new Promise((resolve) => {
          window.setTimeout(resolve, 3000)
        })
      }

      if (isMounted) {
        setIsFinalizing(false)
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [
    completeOnboarding,
    confirmStripePayment,
    locale,
    paymentReference,
    refetch,
    router,
    stripeSessionId,
  ])

  return (
    <AuthCard
      title="Payment successful"
      subtitle="Finalizing your onboarding and activating your plan."
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{statusText}</p>

        <Button
          type="button"
          className="w-full"
          onClick={() => window.location.reload()}
          disabled={isFinalizing}
        >
          {isFinalizing ? 'Finalizing...' : 'Check again'}
        </Button>
      </div>
    </AuthCard>
  )
}
