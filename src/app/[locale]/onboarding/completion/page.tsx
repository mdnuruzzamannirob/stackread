'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useCompleteOnboardingMutation,
  useGetOnboardingPlansQuery,
  useGetOnboardingStatusQuery,
} from '@/store/features/onboarding/onboardingApi'

export default function OnboardingCompletionPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentRequiredFromQuery = searchParams.get('paymentRequired') === '1'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: plansResponse } = useGetOnboardingPlansQuery()
  const { data: statusResponse } = useGetOnboardingStatusQuery()
  const [completeOnboardingMutation] = useCompleteOnboardingMutation()

  const plans = plansResponse?.data ?? []
  const selectedPlanCode = statusResponse?.data?.selectedPlanCode
  const selectedPlan = plans.find((plan) => plan.code === selectedPlanCode)
  const isPaidPlan = Boolean(selectedPlan?.isPaid)
  const paymentRequired = paymentRequiredFromQuery || isPaidPlan

  const handleCompleteOnboarding = async () => {
    if (paymentRequired) {
      toast.error('Paid plans require payment completion before onboarding.')
      return
    }

    setIsSubmitting(true)

    try {
      await completeOnboardingMutation({ agreeToTerms: true }).unwrap()

      toast.success('Onboarding completed')
      router.replace(`/${locale}/dashboard`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to complete onboarding'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Complete onboarding"
      subtitle={
        paymentRequired
          ? 'Your selected plan requires payment handling in the next phase.'
          : 'Confirm your selection to finish setup.'
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {paymentRequired
            ? 'Payment is required for this selected plan. You cannot complete onboarding until payment is done.'
            : 'This final step stores your onboarding state and unlocks the dashboard.'}
        </p>
        <Button
          type="button"
          className="w-full"
          onClick={() => void handleCompleteOnboarding()}
          disabled={isSubmitting || paymentRequired}
        >
          {paymentRequired
            ? 'Payment required'
            : isSubmitting
              ? 'Completing...'
              : 'Complete onboarding'}
        </Button>
      </div>
    </AuthCard>
  )
}
