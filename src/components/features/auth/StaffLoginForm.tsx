'use client'

import { Button } from '@/components/ui/button'
import {
  applyPendingTwoFactorSession,
  applyStaffSession,
} from '@/lib/auth/session'
import { formatApiErrorMessage } from '@/lib/utils/apiHelpers'
import {
  useLazyGetStaffMeQuery,
  useStaffLoginMutation,
} from '@/store/features/staffAuth/staffAuthApi'
import { useAppDispatch } from '@/store/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

export function StaffLoginForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [staffLogin, { isLoading }] = useStaffLoginMutation()
  const [getStaffMe] = useLazyGetStaffMeQuery()

  const redirectPath = useMemo(
    () => searchParams.get('redirect') || '/admin',
    [searchParams],
  )

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const response = await staffLogin(form).unwrap()
      const result = response.data

      if (result.requiresTwoFactor) {
        applyPendingTwoFactorSession(dispatch, result.twoFactorToken)
        router.replace('/admin/2fa')
        return
      }

      const token = result.accessToken
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

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-border p-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Staff Login</h1>
        <p className="text-sm text-muted-foreground">Route: /admin/login</p>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="staff@example.com"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span>Password</span>
        <input
          required
          minLength={8}
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="••••••••"
        />
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Continue'}
      </Button>
    </form>
  )
}
