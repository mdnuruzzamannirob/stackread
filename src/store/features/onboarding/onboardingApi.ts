import { baseApi } from '@/store/baseApi'
import type { ApiResponse } from '@/types'

type OnboardingStatusResult = {
  isOnboardingCompleted: boolean
  selectedPlanId?: string | null
}

type OnboardingSelectPayload = {
  planId: string
}

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingPlans: builder.query<
      ApiResponse<Array<Record<string, unknown>>>,
      void
    >({
      query: () => '/onboarding/plans',
      providesTags: ['Plans'],
    }),
    getOnboardingStatus: builder.query<
      ApiResponse<OnboardingStatusResult>,
      void
    >({
      query: () => '/onboarding/status',
      providesTags: ['UserProfile'],
    }),
    selectOnboardingPlan: builder.mutation<
      ApiResponse<Record<string, unknown>>,
      OnboardingSelectPayload
    >({
      query: (body) => ({
        url: '/onboarding/select',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Plans', 'UserProfile'],
    }),
    completeOnboarding: builder.mutation<
      ApiResponse<Record<string, unknown>>,
      void
    >({
      query: () => ({
        url: '/onboarding/complete',
        method: 'POST',
      }),
      invalidatesTags: ['UserProfile', 'Dashboard'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetOnboardingPlansQuery,
  useGetOnboardingStatusQuery,
  useLazyGetOnboardingStatusQuery,
  useSelectOnboardingPlanMutation,
  useCompleteOnboardingMutation,
} = onboardingApi
