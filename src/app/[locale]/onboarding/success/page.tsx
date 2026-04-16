'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useGetOnboardingStatusQuery } from '@/store/features/onboarding/onboardingApi'

export default function OnboardingSuccessPage() {
  const t = useTranslations('onboarding.success')
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [statusText, setStatusText] = useState(t('waitingForStripe'))
  const [isFinalizing, setIsFinalizing] = useState(true)
  const hasCompletedRef = useRef(false)
  const paymentReference = searchParams.get('ref')
  const stripeSessionId = searchParams.get('session_id')

  const { data: statusResponse, refetch } = useGetOnboardingStatusQuery()

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
        setStatusText(t('checkingPayment', { attempts, maxAttempts }))

        try {
          setStatusText(t('confirmingPayment'))
          const refreshed = await refetch()
          const onboardingStatus = refreshed.data?.data?.status ?? null

          if (onboardingStatus !== 'completed') {
            await new Promise((resolve) => {
              window.setTimeout(resolve, 3000)
            })
            continue
          }

          hasCompletedRef.current = true
          setStatusText(t('completed'))
          toast.success(t('completedToast'))
          router.replace(`/${locale}/dashboard`)
          return
        } catch (error) {
          if (attempts >= maxAttempts) {
            setStatusText(t('takingLonger'))
            toast.error(getApiErrorMessage(error, t('retryLater')))
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
  }, [t, locale, paymentReference, refetch, router, stripeSessionId])

  useEffect(() => {
    if (!paymentReference && !stripeSessionId) {
      return
    }

    const timeout = window.setTimeout(() => {
      setStatusText(t('returnedWaiting'))
    }, 0)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [paymentReference, stripeSessionId, t])

  return (
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{statusText}</p>

        <Button
          type="button"
          className="w-full"
          onClick={() => window.location.reload()}
          disabled={isFinalizing}
        >
          {isFinalizing ? t('finalizing') : t('checkAgain')}
        </Button>
      </div>
    </AuthCard>
  )
}
