'use client'

import { OnboardingShell } from '@/components/OnboardingShell'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useOnboardingStepGuard } from '@/lib/auth/onboarding-flow'
import { cn } from '@/lib/utils'
import { onboardingApi } from '@/store/features/onboarding/onboardingApi'
import { useGetPlansQuery } from '@/store/features/subscriptions/subscriptionsApi'
import { Loader2, Star } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type Feature = {
  label: string
  available: boolean
}

type BillingCycle = 'monthly' | 'yearly'

type UiPlan = {
  id: string
  code: string
  name: string
  desc: string
  free: boolean
  featured?: boolean
  monthlyPrice: number | null
  yearlyPrice: number | null
  recommended: boolean
  sortOrder: number
  currency: string
  cta: string
  features: Feature[]
}

// Feature mapping based on plan access level
const getFeaturesByAccessLevel = (
  accessLevel: string,
  features: string[],
): Feature[] => {
  const allFeatures = [
    'Access free books only',
    'Web reader access',
    'Reading progress sync',
    'Highlights & annotations',
    'Multi-device access',
    'AI tools',
    'Audiobook access',
  ]

  if (accessLevel === 'free') {
    return [
      { label: 'Access free books only', available: true },
      { label: 'Web reader access', available: true },
      { label: 'Reading progress sync', available: false },
      { label: 'Highlights & annotations', available: false },
      { label: 'Multi-device access', available: false },
      { label: 'AI tools', available: false },
      { label: 'Audiobook access', available: false },
    ]
  }

  if (accessLevel === 'basic') {
    return [
      { label: 'Access free + pro books', available: true },
      { label: 'Web reader access', available: true },
      { label: 'Reading progress sync', available: true },
      { label: 'Highlights & annotations', available: true },
      {
        label: `Multi-device access (up to ${features.find((f) => f.includes('devices')) || '3'})`,
        available: true,
      },
      { label: 'AI tools (limited access)', available: true },
      { label: 'Audiobook access', available: false },
    ]
  }

  if (accessLevel === 'premium') {
    return [
      { label: 'Access all books (free + pro + premium)', available: true },
      { label: 'Web reader access', available: true },
      { label: 'Reading progress sync', available: true },
      { label: 'Highlights & annotations', available: true },
      {
        label: `Multi-device access (up to ${features.find((f) => f.includes('devices')) || '5'})`,
        available: true,
      },
      { label: 'AI tools (full access)', available: true },
      { label: 'Audiobook access', available: true },
    ]
  }

  return allFeatures.map((f) => ({ label: f, available: true }))
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="#0F6E56" />
      <path
        d="M4.5 7l2 2L9.5 5"
        stroke="#0F6E56"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg
      className="mt-0.5 size-4 shrink-0 opacity-35"
      viewBox="0 0 14 14"
      fill="none"
    >
      <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
      <path
        d="M5 5l4 4M9 5l-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
}

const formatCurrencyAmount = (amount: number, currency: string) => {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency.toUpperCase()
  return `${symbol}${amount.toFixed(2)}`
}

const getBillingCyclePrice = (plan: UiPlan, billingCycle: BillingCycle) => {
  if (plan.free) {
    return 0
  }

  if (billingCycle === 'yearly') {
    return (
      plan.yearlyPrice ??
      Number(((plan.monthlyPrice ?? 0) * 12 * 0.75).toFixed(2))
    )
  }

  return plan.monthlyPrice ?? 0
}

export default function OnboardingPlanSelectionPage() {
  const params = useParams<{ locale: string }>()
  const locale = (params.locale === 'bn' ? 'bn' : 'en') as 'en' | 'bn'
  const router = useRouter()
  const { onboarding, isLoading: isOnboardingLoading } = useOnboardingStepGuard(
    'plan',
    locale,
  )
  const [processingPlanCode, setProcessingPlanCode] = useState<string | null>(
    null,
  )
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [selectPlan] = onboardingApi.useSelectOnboardingPlanMutation()

  // Fetch plans from backend
  const { data: plansResponse, isLoading: isPlansLoading } = useGetPlansQuery()

  const selectedPlanCode = onboarding?.selectedPlanCode?.toUpperCase() ?? null
  const selectedBillingCycle = onboarding?.selectedBillingCycle ?? 'monthly'

  useEffect(() => {
    if (
      onboarding?.selectedBillingCycle === 'monthly' ||
      onboarding?.selectedBillingCycle === 'yearly'
    ) {
      setBillingCycle(onboarding.selectedBillingCycle)
    }
  }, [onboarding?.selectedBillingCycle])

  // Convert backend plans to UI format
  const uiPlans = useMemo<UiPlan[]>(() => {
    const plans = plansResponse?.data ?? []
    return plans
      .map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        desc: plan.description,
        free: plan.isFree,
        featured: plan.recommended ?? plan.code === 'PREMIUM',
        monthlyPrice: plan.monthlyPrice ?? plan.price,
        yearlyPrice:
          plan.yearlyPrice ??
          Number(
            ((plan.monthlyPrice ?? plan.price) * 12 * 0.75).toFixed(2),
          ),
        recommended: plan.recommended,
        sortOrder: plan.sortOrder,
        currency: plan.currency,
        cta: plan.isFree
          ? 'Get started free'
          : 'Select plan',
        features: getFeaturesByAccessLevel(plan.accessLevel, plan.features),
      }))
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder
        }

        const priceA = a.monthlyPrice ?? Number.POSITIVE_INFINITY
        const priceB = b.monthlyPrice ?? Number.POSITIVE_INFINITY

        if (priceA !== priceB) {
          return priceA - priceB
        }

        return a.name.localeCompare(b.name)
      })
  }, [plansResponse])

  const getPrice = (plan: UiPlan) => getBillingCyclePrice(plan, billingCycle)

  const getBilledNote = (plan: UiPlan) => {
    if (plan.free) return 'No credit card required'
    if (selectedPlanCode === plan.code) {
      return `Selected ${
        selectedBillingCycle === 'yearly' ? 'yearly' : 'monthly'
      } billing. Select this plan again to retry payment.`
    }

    return billingCycle === 'yearly'
      ? 'Billed yearly with 25% savings'
      : 'Billed month to month'
  }

  const handlePlanClick = async (plan: UiPlan) => {
    setProcessingPlanCode(plan.code)

    try {
      const selectedPlanCode = plan.code.toUpperCase()
      const response = await selectPlan({
        planCode: selectedPlanCode,
        locale,
        billingCycle,
      }).unwrap()

      const data = response.data

      if (!data) {
        throw new Error('Plan selection response is empty.')
      }

      const isCompletedStep =
        data.nextStep === 'onboarding_completed' ||
        data.status === 'completed' ||
        plan.free

      if (isCompletedStep) {
        router.push(`/${locale}/onboarding/complete`)
        return
      }

      const checkoutUrl = data.checkout_url ?? data.redirectUrl ?? data.url

      if (!checkoutUrl) {
        throw new Error('Checkout URL is missing in response.')
      }

      window.location.href = checkoutUrl
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to continue with selected plan.'),
      )
    } finally {
      setProcessingPlanCode(null)
    }
  }

  const isPageLoading = isOnboardingLoading || isPlansLoading

  const toggleBillingCycle = () => {
    setBillingCycle((current) => (current === 'monthly' ? 'yearly' : 'monthly'))
  }

  return (
    <OnboardingShell
      stepLabel="Step 4 of 5"
      progress={4}
      title="Choose your plan"
      subtitle="Select the plan that fits your reading habits."
    >
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 rounded-full border border-gray-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:px-6">
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className={cn(billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400')}>
            Monthly
          </span>

          <button
            type="button"
            onClick={toggleBillingCycle}
            className={cn(
              'relative h-8 w-14 rounded-full border border-gray-200 bg-gray-100 p-1 transition-colors',
              billingCycle === 'yearly' && 'bg-teal-100',
            )}
            aria-label="Toggle billing cycle"
          >
            <span
              className={cn(
                'block size-6 rounded-full bg-white shadow-sm transition-transform duration-200',
                billingCycle === 'yearly' && 'translate-x-6 bg-teal-600',
              )}
            />
          </button>

          <span className={cn(billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400')}>
            Annually
          </span>
        </div>

        <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">
          Save 25%
        </span>
      </div>

      {/* Plan Cards */}
      {isPageLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`plan-skeleton-${index}`}
              className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="mb-3 h-4 w-24 rounded-full bg-gray-200" />
              <div className="mb-2 h-7 w-40 rounded bg-gray-200" />
              <div className="mb-4 h-4 w-56 rounded bg-gray-100" />
              <div className="mb-1 h-8 w-28 rounded bg-gray-200" />
              <div className="mb-4 h-3 w-32 rounded bg-gray-100" />
              <div className="flex-1 space-y-3">
                {Array.from({ length: 6 }).map((__, featureIndex) => (
                  <div
                    key={`plan-skeleton-feature-${index}-${featureIndex}`}
                    className="flex items-start gap-2"
                  >
                    <div className="mt-0.5 size-4 rounded-full bg-gray-200" />
                    <div className="h-4 flex-1 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
              <div className="mt-5 h-10 rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {uiPlans.map((plan) => {
            const isFeatured = plan.featured
            const price = getPrice(plan)
            const isSelectedPlan = selectedPlanCode === plan.code
            const isProcessingThisPlan = processingPlanCode === plan.code

            return (
              <div
                key={plan.code}
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-5 transition-all duration-200',
                  isSelectedPlan
                    ? 'border-teal-600 bg-teal-50/25 shadow-[0_18px_45px_rgba(13,148,136,0.12)]'
                    : isFeatured
                      ? 'border-teal-200 shadow-sm'
                      : 'border-gray-200 shadow-sm',
                )}
              >
                {isFeatured ? (
                  <div className="absolute inset-x-0 top-0 flex h-11 items-center justify-center gap-2 bg-teal-600 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                    <Star size={12} /> Recommended
                  </div>
                ) : null}

                <div className={cn('flex h-full flex-col', isFeatured && 'pt-12')}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold tracking-tight text-gray-900">
                        {plan.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                    </div>
                    {isSelectedPlan ? (
                      <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                        Selected
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    {plan.free ? (
                      <span className="text-3xl font-semibold text-gray-900">
                        Free
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-semibold tracking-tight text-gray-900">
                          {formatCurrencyAmount(price, plan.currency)}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          /{billingCycle === 'yearly' ? 'yr' : 'mo'}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {getBilledNote(plan)}
                  </p>

                  <hr className="my-5 border-gray-100" />

                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    What&apos;s included
                  </p>

                  <ul className="mb-5 flex-1 space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li
                        key={i}
                        className={cn(
                          'flex items-start gap-2 text-sm leading-relaxed',
                          feat.available ? 'text-gray-700' : 'text-gray-400',
                        )}
                      >
                        {feat.available ? <CheckIcon /> : <CrossIcon />}
                        <span>{feat.label}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    disabled={Boolean(processingPlanCode)}
                    className={cn(
                      'flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150',
                      isProcessingThisPlan
                        ? 'cursor-not-allowed opacity-50'
                        : isFeatured
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                    )}
                  >
                    {isProcessingThisPlan ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-start">
        <button
          type="button"
          className="px-6 py-2.5 font-medium text-teal-600"
          onClick={() => router.push(`/${locale}/onboarding/language`)}
        >
          Back
        </button>
      </div>
    </OnboardingShell>
  )
}
