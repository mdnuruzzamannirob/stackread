'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { extractRegisterSession } from '@/lib/auth/normalize-auth'
import { persistSession } from '@/lib/auth/token-storage'
import { useRegisterMutation } from '@/store/features/auth/authApi'
import { setAuthenticatedSession } from '@/store/features/auth/authSlice'
import { useAppDispatch } from '@/store/hooks'

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  email: z.email(),
  countryCode: z.string().min(1),
  password: z.string().min(8),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [register, { isLoading }] = useRegisterMutation()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: 'BD',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await register(values).unwrap()
      const session = extractRegisterSession(response.data)

      if (!session) {
        toast.success('Registration complete. Please verify your email.')
        router.push(
          `/${locale}/auth/check-email?email=${encodeURIComponent(values.email)}`,
        )
        return
      }

      persistSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })

      dispatch(
        setAuthenticatedSession({
          token: session.accessToken,
          user: session.user,
        }),
      )

      toast.success('Account created')
      router.push(`/${locale}/dashboard`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Registration failed'))
    }
  })

  return (
    <AuthCard
      title="Create your account"
      subtitle="Phase 2 registration via /auth/register."
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium">First name</label>
          <input
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            {...form.register('firstName')}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Last name</label>
          <input
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            {...form.register('lastName')}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="h-10 w-full rounded-lg border border-input px-3 text-sm"
            {...form.register('email')}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Country code</label>
            <input
              className="h-10 w-full rounded-lg border border-input px-3 text-sm"
              {...form.register('countryCode')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="h-10 w-full rounded-lg border border-input px-3 text-sm"
              {...form.register('password')}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link
          className="text-primary underline-offset-4 hover:underline"
          href={`/${locale}/auth/login`}
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
