'use client'

import { Button } from '@/components/ui/button'
import { applyStaffSession } from '@/lib/auth/session'
import { getAccessToken } from '@/lib/auth/tokenStorage'
import { formatApiErrorMessage } from '@/lib/utils/apiHelpers'
import {
  useLazyGetStaffMeQuery,
  useVerifyTwoFactorMutation,
} from '@/store/features/staffAuth/staffAuthApi'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

export function TwoFactorPanel() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifyTwoFactor, { isLoading }] = useVerifyTwoFactorMutation()
  const [getStaffMe] = useLazyGetStaffMeQuery()
  const pendingToken = useAppSelector(
    (state) => state.auth.pendingTwoFactorToken,
  )

  const redirectPath = useMemo(
    () => searchParams.get('redirect') || '/admin',
    [searchParams],
  )

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const response = await verifyTwoFactor({ code }).unwrap()
      const token = response.data.accessToken
      const meResponse = await getStaffMe(undefined, true).unwrap()

      applyStaffSession(dispatch, {
        token,
        staff: meResponse.data,
      })

      router.replace(redirectPath)
    } catch (submitError) {
      setError(formatApiErrorMessage(submitError))
    }
  }

  const hasChallengeToken = Boolean(pendingToken || getAccessToken('staff'))

  if (!hasChallengeToken) {
    return (
      <div className="space-y-2 rounded-lg border border-border p-6">
        <h1 className="text-2xl font-semibold">Two-factor verification</h1>
        <p className="text-sm text-muted-foreground">
          No pending 2FA session found.
        </p>
        <a href="/admin/login">
          <Button type="button" variant="outline">
            Back to staff login
          </Button>
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-border p-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Two-factor verification</h1>
        <p className="text-sm text-muted-foreground">Route: /admin/2fa</p>
      </div>

      <label className="block space-y-1 text-sm">
        <span>6-digit code</span>
        <input
          required
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/[^0-9]/g, '').slice(0, 6))
          }
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="123456"
        />
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify code'}
      </Button>
    </form>
  )
}
