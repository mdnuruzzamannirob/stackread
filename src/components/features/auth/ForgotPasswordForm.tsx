'use client'

import { Button } from '@/components/ui/button'
import { formatApiErrorMessage } from '@/lib/utils/apiHelpers'
import { useForgotPasswordMutation } from '@/store/features/auth/authApi'
import { useState } from 'react'

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)
    setError(null)

    try {
      const response = await forgotPassword({ email }).unwrap()
      setStatus(
        response.message ?? 'Reset instructions sent if account exists.',
      )
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
        <h1 className="text-2xl font-semibold">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Route: /auth/forgot-password
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="you@example.com"
        />
      </label>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Send reset instructions'}
      </Button>

      {status ? <p className="text-sm text-primary">{status}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  )
}
