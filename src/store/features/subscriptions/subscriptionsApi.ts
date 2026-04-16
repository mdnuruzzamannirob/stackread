import type { ApiEnvelope } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'

export type SubscriptionStatus =
  | 'pending'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'upgraded'
  | 'downgraded'

export type SubscriptionRetryStatus =
  | 'scheduled'
  | 'processing'
  | 'succeeded'
  | 'exhausted'

export type SubscriptionSummary = {
  id: string
  userId: string
  planId: string
  previousPlanId?: string
  status: SubscriptionStatus
  startedAt: string
  endsAt: string | null
  currentPeriodEnd?: string | null
  autoRenew: boolean
  cancelledAt?: string
  cancellationReason?: string
  pendingInvoiceId?: string | null
  retryStatus?: SubscriptionRetryStatus | null
  retryAttemptCount?: number
  retryNextAt?: string | null
  retryLastAttemptAt?: string | null
  retryLastError?: string | null
  latestPaymentId?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

export type PlanSummary = {
  id: string
  code: string
  name: string
  description: string
  price: number
  currency: string
  durationDays: number
  maxDevices: number
  downloadEnabled: boolean
  accessLevel: 'free' | 'basic' | 'premium'
  features: string[]
  isFree: boolean
  stripeProductId?: string
  stripePriceId?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

type CancelSubscriptionBody = {
  reason: string
  immediate?: boolean
}

type ChangePlanBody = {
  newPlanId: string
}

type InitiatePaymentBody = {
  planId: string
  gateway: 'stripe'
  autoRenew?: boolean
}

type InitiatePaymentResponse = {
  sessionId?: string
  url?: string
  redirectUrl?: string
  checkout_url?: string
}

type RetryPaymentResponse = ApiEnvelope<SubscriptionSummary>

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<
      ApiEnvelope<SubscriptionSummary | null>,
      void
    >({
      query: () => ({
        url: '/subscriptions/my',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    getPlans: builder.query<ApiEnvelope<PlanSummary[]>, void>({
      query: () => ({
        url: '/plans',
        method: 'GET',
      }),
      providesTags: ['Plan'],
    }),
    cancelMySubscription: builder.mutation<
      ApiEnvelope<SubscriptionSummary>,
      CancelSubscriptionBody
    >({
      query: (body) => ({
        url: '/subscriptions/my/cancel',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    renewMySubscription: builder.mutation<
      ApiEnvelope<SubscriptionSummary>,
      void
    >({
      query: () => ({
        url: '/subscriptions/my/renew',
        method: 'PATCH',
      }),
      invalidatesTags: ['Subscription'],
    }),
    upgradeMySubscription: builder.mutation<
      ApiEnvelope<SubscriptionSummary>,
      ChangePlanBody
    >({
      query: (body) => ({
        url: '/subscriptions/my/upgrade',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    downgradeMySubscription: builder.mutation<
      ApiEnvelope<SubscriptionSummary>,
      ChangePlanBody
    >({
      query: (body) => ({
        url: '/subscriptions/my/downgrade',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    retryMySubscriptionPayment: builder.mutation<RetryPaymentResponse, void>({
      query: () => ({
        url: '/subscriptions/my/retry-payment',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    initiateStripePayment: builder.mutation<
      ApiEnvelope<InitiatePaymentResponse>,
      InitiatePaymentBody
    >({
      query: (body) => ({
        url: '/payments/initiate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const {
  useGetMySubscriptionQuery,
  useGetPlansQuery,
  useCancelMySubscriptionMutation,
  useRenewMySubscriptionMutation,
  useUpgradeMySubscriptionMutation,
  useDowngradeMySubscriptionMutation,
  useRetryMySubscriptionPaymentMutation,
  useInitiateStripePaymentMutation,
} = subscriptionsApi
