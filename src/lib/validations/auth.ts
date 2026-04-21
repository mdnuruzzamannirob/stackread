import { z } from 'zod'

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
  password: z.string().min(1, 'Password is required'),
})

export type LoginSchema = z.infer<typeof loginSchema>

// 2FA OTP validation (6 digits)
export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, 'Please enter a valid 6-digit code')
  .min(1, 'Enter your verification code')

export const twoFactorChallengeSchema = z.object({
  otp: otpSchema,
})

export type TwoFactorChallengeSchema = z.infer<typeof twoFactorChallengeSchema>

// Recovery code validation (8 alphanumeric)
export const recoveryCodeSchema = z
  .string()
  .regex(/^[A-Z0-9]{8}$/, 'Please enter a valid recovery code')
  .min(1, 'Enter your recovery code')

export const recoveryCodeChallengeSchema = z.object({
  code: recoveryCodeSchema,
})

export type RecoveryCodeChallengeSchema = z.infer<
  typeof recoveryCodeChallengeSchema
>

// Register validation
export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    email: z.string().email('Please enter a valid email address').trim(),
    phone: z.string().optional().default(''),
    address: z.string().optional().default(''),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>

// Email verification validation
export const emailVerificationSchema = z.object({
  otp: otpSchema,
})

export type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>

// Forgot password validation
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

// Password reset validation
export const passwordResetSchema = z
  .object({
    otp: otpSchema,
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type PasswordResetSchema = z.infer<typeof passwordResetSchema>
