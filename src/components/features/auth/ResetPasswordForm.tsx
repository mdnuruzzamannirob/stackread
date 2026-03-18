'use client'

import { Button } from '@/components/ui/button'
import { formatApiErrorMessage } from '@/lib/utils/apiHelpers'
import { useResetPasswordMutation } from '@/store/features/auth/authApi'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const initialToken = useMemo(
    () => searchParams.get('token') ?? '',
    [searchParams],
  )

  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [token, setToken] = useState(initialToken)
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)
    setError(null)

    try {
      const response = await resetPassword({ token, newPassword }).unwrap()
      setStatus(response.message ?? 'Password reset complete.')
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
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Route: /auth/reset-password
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Reset token</span>
        <input
          required
          minLength={10}
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="Paste token"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span>New password</span>
        <input
          required
          minLength={8}
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="At least 8 characters"
        />
      </label>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset password'}
      </Button>

      {status ? <p className="text-sm text-primary">{status}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  )
}
