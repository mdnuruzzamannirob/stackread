'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'

export default function OnboardingCancelPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'

  return (
    <AuthCard
      title="Payment canceled"
      subtitle="No charge was made. You can pick a plan again anytime."
    >
      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href={`/${locale}/onboarding/plan-selection`}>
            Choose a plan again
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/${locale}/dashboard`}>Return to dashboard</Link>
        </Button>
      </div>
    </AuthCard>
  )
}
