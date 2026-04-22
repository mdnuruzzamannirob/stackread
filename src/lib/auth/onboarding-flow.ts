'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { onboardingApi } from '@/store/features/onboarding/onboardingApi'

import {
  resolveOnboardingStepRedirect,
  type OnboardingPageStep,
} from './onboarding'

export function useOnboardingStepGuard(
  page: OnboardingPageStep,
  locale: string,
) {
  const router = useRouter()
  const { data, isLoading, isFetching } =
    onboardingApi.useGetOnboardingStatusQuery()

  const onboarding = data?.data ?? null
  const redirectTo = resolveOnboardingStepRedirect({
    locale,
    page,
    onboarding,
  })

  useEffect(() => {
    if (isLoading || isFetching || !redirectTo) {
      return
    }

    router.replace(redirectTo)
  }, [isFetching, isLoading, redirectTo, router])

  return {
    onboarding,
    isLoading: isLoading || isFetching,
  }
}
