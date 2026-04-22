import { z } from 'zod'

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
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
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .trim(),
    lastName: z.string().trim().optional().or(z.literal('')),
    email: z.string().email('Please enter a valid email address').trim(),
    phone: z
      .string()
      .min(6, 'Phone number is required')
      .trim()
      .optional()
      .or(z.literal(null)),
    address: z
      .string()
      .min(2, 'Address is required')
      .trim()
      .optional()
      .or(z.literal(null)),
    countryCode: z.string().min(2, 'Country code is required').max(3),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must include at least one special character',
      ),
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
