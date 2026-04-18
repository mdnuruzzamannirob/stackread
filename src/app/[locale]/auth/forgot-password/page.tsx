'use client'

import { ArrowLeft, Mail } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { AuthSplitShell } from '@/components/auth/authSplitShell'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import { useForgotPasswordMutation } from '@/store/features/auth/authApi'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Enter a valid email address.'),
})

type ForgotValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  useRedirectAuthenticated(locale)
  const [values, setValues] = useState<ForgotValues>({ email: '' })
  const [emailError, setEmailError] = useState<string>('')
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const onSubmit = async () => {
    const validation = forgotPasswordSchema.safeParse(values)

    if (!validation.success) {
      const firstIssue = validation.error.issues.find(
        (issue) => issue.path[0] === 'email',
      )
      setEmailError(firstIssue?.message ?? 'Enter a valid email address.')
      return
    }

    setEmailError('')

    try {
      await forgotPassword({ email: validation.data.email }).unwrap()
      toast.success('Reset link sent successfully.')
      router.push(
        `/${locale}/auth/verify-otp?email=${encodeURIComponent(validation.data.email)}`,
      )
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not send reset link.'))
    }
  }

  return (
    <AuthSplitShell
      brandLabel="StackRead"
      heroVariant="forgot"
      heroTitle={
        <>
          Recover your
          <br />
          <span className="italic text-[#ffbf57]">access to wisdom.</span>
        </>
      }
      heroDescription="Rejoin the curated collection. Your intellectual journey awaits just beyond this step."
      heading="Forgot Password?"
      description="Enter the email address associated with your account, and we'll send you a link to reset your password."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.14em] text-[#2f3c4a] uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6a7785]" />
            <input
              value={values.email}
              onChange={(event) => {
                setValues({ email: event.target.value })
                if (emailError) {
                  setEmailError('')
                }
              }}
              type="email"
              className={`h-12 w-full rounded-md border border-transparent bg-[#e4e8eb] px-11 text-[15px] text-[#11151a] placeholder:text-[#8d98a3] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0a6f79] ${emailError ? 'bg-[#fce8e8] text-[#b42318] placeholder:text-[#d66f6f] focus:ring-[#d92d20]' : ''}`}
              placeholder="name@example.com"
              aria-invalid={Boolean(emailError)}
            />
          </div>
          {emailError ? (
            <p className="text-xs text-[#d92d20]">{emailError}</p>
          ) : null}
        </div>

        <button
          type="button"
          className="h-12 w-full rounded-md bg-[#006d77] text-[17px] font-semibold text-white transition hover:bg-[#005a62] focus:outline-none focus:ring-2 focus:ring-[#0a6f79] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/${locale}/auth/login`)}
          className="mx-auto flex items-center gap-2 text-sm text-[#184f79] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Log In
        </button>
      </div>
    </AuthSplitShell>
  )
}
