'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useGetOnboardingPlansQuery,
  useGetOnboardingStatusQuery,
  useSelectOnboardingPlanMutation,
} from '@/store/features/onboarding/onboardingApi'

export default function OnboardingPlanSelectionPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null)
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false)
  const { data: plansResponse, isLoading: isPlansLoading } =
    useGetOnboardingPlansQuery()
  const { data: statusResponse } = useGetOnboardingStatusQuery()
  const [selectOnboardingPlan, { isLoading: isSubmitting }] =
    useSelectOnboardingPlanMutation()

  const plans = Array.isArray(plansResponse?.data) ? plansResponse.data : []

  useEffect(() => {
    if (statusResponse?.data?.status === 'completed') {
      router.replace(`/${locale}/dashboard`)
    }
  }, [locale, router, statusResponse?.data?.status])

  const selectPlan = async (planCode: string) => {
    setSelectedPlanCode(planCode)

    try {
      const response = await selectOnboardingPlan({ planCode }).unwrap()
      const nextStep = response.data?.nextStep
      const checkoutUrl = response.data?.checkout_url

      toast.success('Plan selected')

      if (nextStep === 'redirect_to_payment') {
        if (!checkoutUrl) {
          toast.error('Payment URL is missing. Please try again.')
          return
        }

        setIsRedirectingToStripe(true)
        window.location.href = checkoutUrl
        return
      }

      router.push(`/${locale}/dashboard`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to select plan'))
    } finally {
      setIsRedirectingToStripe(false)
    }
  }

  return (
    <AuthCard
      title="Choose a plan"
      subtitle="Select the onboarding plan that fits your account."
    >
      {isPlansLoading ? (
        <p className="text-sm text-muted-foreground">Loading plans...</p>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.code}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {plan.isPaid ? 'Paid plan' : 'Free plan'} ·{' '}
                    {plan.billingCycle}
                  </p>
                </div>
                <p className="text-right text-lg font-semibold">
                  {plan.price === 0 ? 'Free' : `৳${plan.price}`}
                </p>
              </div>

              <Button
                type="button"
                className="mt-4 w-full"
                onClick={() => void selectPlan(plan.code)}
                disabled={
                  isRedirectingToStripe ||
                  (isSubmitting && selectedPlanCode !== plan.code)
                }
              >
                {selectedPlanCode === plan.code && isSubmitting
                  ? isRedirectingToStripe
                    ? 'Redirecting to Stripe...'
                    : 'Saving...'
                  : 'Select plan'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </AuthCard>
  )
}
