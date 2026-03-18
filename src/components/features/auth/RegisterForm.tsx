'use client'

import { Button } from '@/components/ui/button'
import { formatApiErrorMessage } from '@/lib/utils/apiHelpers'
import { useRegisterMutation } from '@/store/features/auth/authApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RegisterForm() {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: 'BD',
  })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      await register({
        ...form,
        countryCode: form.countryCode.toUpperCase(),
      }).unwrap()

      router.replace(
        `/auth/verify-email?email=${encodeURIComponent(form.email)}`,
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
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">Route: /auth/register</p>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Name</span>
        <input
          required
          minLength={2}
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="h-10 w-full rounded-md border border-input bg-background px-3"
          placeholder="Your name"
        />
      </label>

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
          placeholder="you@example.com"
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
          placeholder="At least 8 characters"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span>Country code</span>
        <input
          required
          minLength={2}
          maxLength={2}
          value={form.countryCode}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              countryCode: event.target.value.toUpperCase(),
            }))
          }
          className="h-10 w-full rounded-md border border-input bg-background px-3 uppercase"
          placeholder="BD"
        />
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Register'}
      </Button>

      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
