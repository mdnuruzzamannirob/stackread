'use client'

import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import {
  useGetPlansQuery,
  useInitiateStripePaymentMutation,
} from '@/store/features/subscriptions/subscriptionsApi'
import { useAppSelector } from '@/store/hooks'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OnboardingPaymentPendingPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()

  const planId = searchParams.get('plan_id')
  const planName = searchParams.get('plan_name')
  const billingCycle = searchParams.get('billing_cycle')
  const price = searchParams.get('price')

  // Get user from Redux store
  const user = useAppSelector((state) => state.auth.user)
  const userId = user?.id

  // Get plans to find the plan object ID
  const { data: plansResponse } = useGetPlansQuery()
  const plans = plansResponse?.data ?? []

  // Find the plan object ID from the plan code
  const selectedPlan = plans.find((p) => p.code === planId)

  const [initiatePayment] = useInitiateStripePaymentMutation()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initPayment = async () => {
      if (!userId || !selectedPlan) return

      setIsProcessing(true)

      try {
        const result = await initiatePayment({
          planId: selectedPlan.id,
          gateway: 'stripe',
          autoRenew: true,
        }).unwrap()

        // Redirect to Stripe checkout URL
        const checkoutUrl =
          result.data?.checkout_url ||
          result.data?.redirectUrl ||
          result.data?.url

        if (checkoutUrl) {
          window.location.href = checkoutUrl
        } else {
          setError('Unable to create checkout session. Please try again.')
          setIsProcessing(false)
        }
      } catch (err) {
        console.error('Payment initiation failed:', err)
        setError('Failed to initiate payment. Please try again.')
        setIsProcessing(false)
      }
    }

    initPayment()
  }, [userId, selectedPlan, initiatePayment])

  return (
    <OnboardingShell
      stepLabel="Step 4 of 5"
      progress={4}
      title="Complete your purchase"
      subtitle={`Setting up ${planName} - $${price}/${billingCycle === 'annually' ? 'year' : 'month'}`}
    >
      <div className="flex flex-col items-center justify-center py-12">
        {error ? (
          <div className="max-w-sm w-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-teal-600" size={48} />
            <div className="text-center">
              <p className="text-gray-900 font-medium">
                Redirecting to Stripe...
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Please wait while we set up your secure checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </OnboardingShell>
  )
}
