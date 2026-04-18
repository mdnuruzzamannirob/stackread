'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  type ClipboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { AuthSplitShell } from '@/components/auth/authSplitShell'
import { getApiErrorMessage } from '@/lib/api/error-message'
import { useRedirectAuthenticated } from '@/lib/auth/guards'
import {
  useResendResetOtpMutation,
  useVerifyResetOtpMutation,
} from '@/store/features/auth/authApi'

const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Enter a valid email address.'),
  otp: z.string().regex(/^\d{6}$/, 'Verification code must be 6 digits.'),
})

type VerifyValues = z.infer<typeof verifyOtpSchema>

function getCooldownLabel(seconds: number) {
  return seconds > 0 ? `Resend in ${seconds}s` : 'Resend Code'
}

export default function VerifyOtpPage() {
  const params = useParams<{ locale: string }>()
  const locale = params.locale ?? 'en'
  const router = useRouter()
  const searchParams = useSearchParams()
  useRedirectAuthenticated(locale)

  const [values, setValues] = useState<VerifyValues>({
    email: searchParams.get('email') ?? '',
    otp: '',
  })
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  const [resendResetOtp, { isLoading: isResending }] =
    useResendResetOtpMutation()
  const [verifyResetOtp, { isLoading: isVerifying }] =
    useVerifyResetOtpMutation()

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const interval = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1))
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [cooldown])

  const normalizedOtp = useMemo(
    () => values.otp.replace(/\D/g, '').slice(0, 6),
    [values.otp],
  )
  const otpDigits = useMemo(() => {
    const paddedOtp = normalizedOtp.padEnd(6, ' ')
    return paddedOtp.split('').slice(0, 6)
  }, [normalizedOtp])

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const currentDigits = normalizedOtp.split('')

    currentDigits[index] = digit
    const nextOtp = currentDigits.join('').slice(0, 6)

    setValues((previous) => ({ ...previous, otp: nextOtp }))
    if (otpError) {
      setOtpError('')
    }

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === 'Backspace') {
      if (otpDigits[index]?.trim()) {
        const currentDigits = normalizedOtp.split('')
        currentDigits[index] = ''
        setValues((previous) => ({ ...previous, otp: currentDigits.join('') }))
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pastedValue = event.clipboardData.getData('text')
    const digits = pastedValue.replace(/\D/g, '').slice(0, 6)
    setValues((previous) => ({ ...previous, otp: digits }))
    if (otpError) {
      setOtpError('')
    }
    const focusIndex = Math.min(digits.length, 5)
    otpRefs.current[focusIndex]?.focus()
  }

  const validateForm = () => {
    const validation = verifyOtpSchema.safeParse({
      email: values.email,
      otp: normalizedOtp,
    })

    if (validation.success) {
      setEmailError('')
      setOtpError('')
      return validation.data
    }

    const emailIssue = validation.error.issues.find(
      (issue) => issue.path[0] === 'email',
    )
    const otpIssue = validation.error.issues.find(
      (issue) => issue.path[0] === 'otp',
    )

    setEmailError(emailIssue?.message ?? '')
    setOtpError(otpIssue?.message ?? '')
    return null
  }

  const onResend = async () => {
    if (cooldown > 0) {
      return
    }

    const emailValidation = z
      .string()
      .trim()
      .min(1, 'Email address is required.')
      .email('Enter a valid email address.')
      .safeParse(values.email)

    if (!emailValidation.success) {
      setEmailError(
        emailValidation.error.issues[0]?.message ?? 'Invalid email.',
      )
      return
    }

    setEmailError('')

    try {
      await resendResetOtp({ email: emailValidation.data }).unwrap()
      setCooldown(60)
      toast.success('Verification code resent.')
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Could not resend verification code.'),
      )
    }
  }

  const onVerify = async () => {
    const validatedData = validateForm()
    if (!validatedData) {
      return
    }

    try {
      const response = await verifyResetOtp({
        email: validatedData.email,
        otp: validatedData.otp,
      }).unwrap()

      const resetToken = response.data?.resetToken

      if (!resetToken) {
        toast.error('Reset token missing in response.')
        return
      }

      toast.success('Verification complete.')
      router.push(
        `/${locale}/auth/reset-password?resetToken=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(validatedData.email)}`,
      )
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Invalid or expired verification code.'),
      )
    }
  }

  return (
    <AuthSplitShell
      brandLabel="StackRead"
      heroVariant="verify"
      heroTitle={
        <>
          Verify Your
          <br />
          Identity
        </>
      }
      heroDescription="A security code has been sent to your email to ensure the safety of your archive."
      heading="Enter Verification Code"
      description="We've sent a 6-digit code to your registered email address. Please enter it below to continue with your password reset."
      legalLinks={[
        '© 2024 Lumina Lexicon. Editorial Intelligence.',
        'Support',
        'Privacy Policy',
        'Terms of Service',
      ]}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.14em] text-[#2f3c4a] uppercase">
            Verification Code
          </label>
          <div className="flex gap-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  otpRefs.current[index] = element
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit.trim()}
                onPaste={handleOtpPaste}
                onKeyDown={(event) => handleOtpKeyDown(event, index)}
                onChange={(event) => handleOtpInput(index, event.target.value)}
                className={`h-14 w-14 rounded-md border border-transparent bg-[#e4e8eb] text-center text-xl font-semibold text-[#152130] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0a6f79] ${otpError ? 'bg-[#fce8e8] text-[#b42318] focus:ring-[#d92d20]' : ''}`}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          {otpError ? (
            <p className="text-xs text-[#d92d20]">{otpError}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.14em] text-[#2f3c4a] uppercase">
            Email Address
          </label>
          <input
            value={values.email}
            onChange={(event) => {
              setValues((previous) => ({
                ...previous,
                email: event.target.value,
              }))
              if (emailError) {
                setEmailError('')
              }
            }}
            type="email"
            className={`h-12 w-full rounded-md border border-transparent bg-[#e4e8eb] px-4 text-[15px] text-[#11151a] placeholder:text-[#8d98a3] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0a6f79] ${emailError ? 'bg-[#fce8e8] text-[#b42318] placeholder:text-[#d66f6f] focus:ring-[#d92d20]' : ''}`}
            placeholder="name@example.com"
            aria-invalid={Boolean(emailError)}
          />
          {emailError ? (
            <p className="text-xs text-[#d92d20]">{emailError}</p>
          ) : null}
        </div>

        <button
          type="button"
          className="h-12 w-full rounded-md bg-[#006d77] text-[17px] font-semibold text-white transition hover:bg-[#005a62] focus:outline-none focus:ring-2 focus:ring-[#0a6f79] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={onVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <p className="text-center text-sm text-[#3d4a57]">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="font-semibold text-[#0a5369] hover:underline disabled:no-underline disabled:opacity-60"
            onClick={onResend}
            disabled={isResending || cooldown > 0}
          >
            {isResending ? 'Sending...' : getCooldownLabel(cooldown)}
          </button>
        </p>
      </div>
    </AuthSplitShell>
  )
}
