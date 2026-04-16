'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  type PlanSummary,
  type SubscriptionSummary,
  useCancelMySubscriptionMutation,
  useDowngradeMySubscriptionMutation,
  useGetMySubscriptionQuery,
  useGetPlansQuery,
  useInitiateStripePaymentMutation,
  useRenewMySubscriptionMutation,
  useRetryMySubscriptionPaymentMutation,
} from '@/store/features/subscriptions/subscriptionsApi'

const asMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

const bySortOrder = (a: PlanSummary, b: PlanSummary) => {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder
  }

  return a.price - b.price
}

const formatDateLabel = (value?: string | null) => {
  if (!value) {
    return 'Not set'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Not set'
  }

  return parsed.toLocaleDateString()
}

const formatStateLabel = (value: string) => {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const getStatusToneClass = (status: SubscriptionSummary['status']) => {
  switch (status) {
    case 'active':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
    case 'past_due':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-700'
    case 'pending':
      return 'border-sky-500/30 bg-sky-500/10 text-sky-700'
    case 'expired':
    case 'cancelled':
      return 'border-destructive/30 bg-destructive/10 text-destructive'
    default:
      return 'border-border bg-muted text-foreground'
  }
}

export function SubscriptionManagementCard() {
  const t = useTranslations('subscription')
  const [cancelReason, setCancelReason] = useState('')
  const [cancelImmediately, setCancelImmediately] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('')

  const { data: subscriptionResponse, isFetching: isSubscriptionLoading } =
    useGetMySubscriptionQuery()
  const { data: plansResponse, isFetching: isPlansLoading } = useGetPlansQuery()

  const [cancelMySubscription, { isLoading: isCancelling }] =
    useCancelMySubscriptionMutation()
  const [renewMySubscription, { isLoading: isRenewing }] =
    useRenewMySubscriptionMutation()
  const [downgradeMySubscription, { isLoading: isDowngrading }] =
    useDowngradeMySubscriptionMutation()
  const [retryMySubscriptionPayment, { isLoading: isRetrying }] =
    useRetryMySubscriptionPaymentMutation()
  const [initiateStripePayment, { isLoading: isInitiatingPayment }] =
    useInitiateStripePaymentMutation()

  const subscription = subscriptionResponse?.data ?? null
  const plans = useMemo(
    () => [...(plansResponse?.data ?? [])].sort(bySortOrder),
    [plansResponse?.data],
  )

  const currentPlan = subscription?.planId
    ? plans.find((plan) => plan.id === subscription.planId)
    : undefined

  const changeablePlans = plans.filter(
    (plan) => !subscription || plan.id !== subscription.planId,
  )

  const selectedPlan = changeablePlans.find(
    (plan) => plan.id === selectedPlanId,
  )

  const isBusy =
    isCancelling ||
    isRenewing ||
    isDowngrading ||
    isInitiatingPayment ||
    isRetrying

  const isActiveSubscription = subscription?.status === 'active'
  const isFreeCurrentPlan = Boolean(currentPlan?.isFree)
  const hasRetryState = Boolean(
    subscription?.pendingInvoiceId || subscription?.retryStatus,
  )

  const retrySummary = subscription
    ? [
        subscription.retryStatus
          ? formatStateLabel(subscription.retryStatus)
          : null,
        typeof subscription.retryAttemptCount === 'number'
          ? `Attempts: ${subscription.retryAttemptCount}`
          : null,
      ].filter(Boolean)
    : []

  const canRetryPayment = Boolean(
    subscription?.pendingInvoiceId && subscription.retryStatus !== 'processing',
  )

  const handleCancel = async () => {
    if (!isActiveSubscription) {
      toast.error('Cancellation is only available for active subscriptions.')
      return
    }

    if (isFreeCurrentPlan) {
      toast.error('Free plans do not support cancellation.')
      return
    }

    const reason = cancelReason.trim()

    if (reason.length < 3) {
      toast.error('Please provide a cancellation reason (min 3 characters).')
      return
    }

    try {
      const response = await cancelMySubscription({
        reason,
        immediate: cancelImmediately,
      }).unwrap()

      if (cancelImmediately) {
        toast.success(t('cancelImmediateSuccess'))
      } else if (
        response.data.stripeSubscriptionId &&
        response.data.status === 'active'
      ) {
        toast.success(t('cancelScheduledSuccess'))
      } else {
        toast.success(t('cancelledSuccess'))
      }

      setCancelReason('')
      setCancelImmediately(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to cancel subscription.'))
    }
  }

  const handleRenew = async () => {
    if (!isActiveSubscription) {
      toast.error('Renewal is only available for active subscriptions.')
      return
    }

    if (isFreeCurrentPlan) {
      toast.error('Free plans do not support renewal.')
      return
    }

    try {
      await renewMySubscription().unwrap()
      toast.success('Subscription renewed successfully.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to renew subscription.'))
    }
  }

  const handleChangePlan = async () => {
    if (!selectedPlan) {
      toast.error('Please choose a target plan first.')
      return
    }

    if (subscription && currentPlan && selectedPlan.id === currentPlan.id) {
      toast.error('Please choose a different plan.')
      return
    }

    try {
      if (selectedPlan.isFree) {
        if (!subscription || !currentPlan) {
          toast.error('You are already on free access.')
          return
        }

        await downgradeMySubscription({ newPlanId: selectedPlan.id }).unwrap()
        toast.success('Switched to free plan successfully.')
      } else {
        const paymentResponse = await initiateStripePayment({
          planId: selectedPlan.id,
          gateway: 'stripe',
          autoRenew: true,
        }).unwrap()

        const redirectUrl =
          paymentResponse.data.url ??
          paymentResponse.data.redirectUrl ??
          paymentResponse.data.checkout_url

        if (!redirectUrl) {
          toast.error('Payment URL is missing. Please try again.')
          return
        }

        toast.success('Redirecting to Stripe checkout...')
        window.location.assign(redirectUrl)
        return
      }

      setSelectedPlanId('')
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to change subscription plan.'),
      )
    }
  }

  const handleRetryPayment = async () => {
    if (!canRetryPayment) {
      toast.error(t('retryUnavailable'))
      return
    }

    try {
      await retryMySubscriptionPayment().unwrap()
      toast.success(t('retrySuccess'))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('retryFailed')))
    }
  }

  return (
    <section
      id="subscription-management"
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="text-xl font-semibold tracking-tight">{t('title')}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>

      {isSubscriptionLoading || isPlansLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Loading subscription details...
        </p>
      ) : (
        <div className="mt-5 space-y-6">
          {!subscription ? (
            <p className="mt-1 text-sm text-muted-foreground">
              No active or pending subscription found for your account.
            </p>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('currentStatus')}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    {currentPlan?.name ?? 'Unknown plan'}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subscription.status === 'pending'
                      ? t('pendingStatusDescription')
                      : subscription.status === 'past_due'
                        ? t('pastDueStatusDescription')
                        : subscription.status === 'expired'
                          ? t('expiredStatusDescription')
                          : t('activeStatusDescription')}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusToneClass(subscription.status)}`}
                >
                  {formatStateLabel(subscription.status)}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t('planLabel')}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {currentPlan?.name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentPlan?.isFree
                      ? t('freePlanLabel')
                      : t('paidPlanLabel')}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t('renewalLabel')}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {subscription.autoRenew
                      ? t('automaticRenewal')
                      : t('manualRenewal')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('endsLabel')}: {formatDateLabel(subscription.endsAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t('periodEndLabel')}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDateLabel(subscription.currentPeriodEnd)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('billingWindowLabel')}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t('paymentLinkLabel')}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {subscription.pendingInvoiceId ?? t('notPending')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.retryStatus
                      ? `${t('retryLabel')}: ${formatStateLabel(subscription.retryStatus)}`
                      : t('noRetryScheduled')}
                  </p>
                </div>
              </div>

              {hasRetryState ? (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900">
                  <p className="font-medium">{t('paymentRecoveryTitle')}</p>
                  <div className="mt-2 space-y-1 text-amber-900/80">
                    {retrySummary.length ? (
                      <p>{retrySummary.join(' · ')}</p>
                    ) : null}
                    {subscription.retryNextAt ? (
                      <p>
                        {t('nextRetry')}:{' '}
                        {formatDateLabel(subscription.retryNextAt)}
                      </p>
                    ) : null}
                    {subscription.retryLastAttemptAt ? (
                      <p>
                        {t('lastAttempt')}:{' '}
                        {formatDateLabel(subscription.retryLastAttemptAt)}
                      </p>
                    ) : null}
                    {subscription.retryLastError ? (
                      <p>
                        {t('lastError')}: {subscription.retryLastError}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {!isActiveSubscription ? (
                <p className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  {t('inactiveNotice', {
                    status: formatStateLabel(subscription.status),
                  })}
                </p>
              ) : null}
            </div>
          )}

          {canRetryPayment ? (
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-medium">{t('retryTitle')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('retryDescription')}
              </p>
              <Button
                type="button"
                className="mt-3"
                onClick={() => void handleRetryPayment()}
                disabled={isBusy}
              >
                {isRetrying ? t('retrying') : t('retryAction')}
              </Button>
            </div>
          ) : null}

          {!isFreeCurrentPlan && subscription ? (
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-medium">{t('renewTitle')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('renewDescription')}
              </p>
              <Button
                type="button"
                className="mt-3"
                onClick={() => void handleRenew()}
                disabled={isBusy || !isActiveSubscription}
              >
                {isRenewing ? t('renewing') : t('renewAction')}
              </Button>
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="font-medium">{t('changePlanTitle')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('changePlanDescription')}
            </p>
            <div className="mt-3 grid gap-2">
              {changeablePlans.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('noAlternativePlans')}
                </p>
              ) : (
                changeablePlans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      disabled={isBusy}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? 'border-primary bg-accent'
                          : 'border-border hover:bg-accent/40'
                      }`}
                    >
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-muted-foreground">
                        {asMoney(plan.price, plan.currency)}{' '}
                        {plan.isFree
                          ? `· ${t('freePlanLabel')}`
                          : `· ${t('paidPlanLabel')}`}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
            <Button
              type="button"
              className="mt-3"
              onClick={() => void handleChangePlan()}
              disabled={isBusy || !selectedPlanId}
            >
              {isInitiatingPayment
                ? t('redirectingToStripe')
                : isDowngrading
                  ? t('submitting')
                  : t('submitPlanChange')}
            </Button>
          </div>

          {!isFreeCurrentPlan && subscription ? (
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-medium">{t('cancelTitle')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('cancelDescription')}
              </p>
              <textarea
                className="mt-3 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder={t('cancelReasonPlaceholder')}
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                disabled={isBusy || !isActiveSubscription}
              />
              <label className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={cancelImmediately}
                  onChange={(event) =>
                    setCancelImmediately(event.target.checked)
                  }
                  disabled={isBusy || !isActiveSubscription}
                />
                <span>
                  <span className="block font-medium text-foreground">
                    {t('cancelImmediatelyLabel')}
                  </span>
                  <span className="block">
                    {t('cancelImmediatelyDescription')}
                  </span>
                </span>
              </label>
              <Button
                type="button"
                variant="destructive"
                className="mt-3"
                onClick={() => void handleCancel()}
                disabled={isBusy || !isActiveSubscription}
              >
                {isCancelling
                  ? t('cancelling')
                  : cancelImmediately
                    ? t('cancelImmediateAction')
                    : t('cancelAction')}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
