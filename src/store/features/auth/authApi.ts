import type { ApiEnvelope } from '@/lib/api/types'
import { baseApi } from '@/store/baseApi'
import type { LoginPayload, UserProfile } from '@/store/features/auth/types'

type RegisterBody = {
  firstName: string
  lastName?: string
  email: string
  password: string
  countryCode: string
}

type LoginBody = {
  email: string
  password: string
}

type VerifyEmailBody = { token: string }
type EmailBody = { email: string }
type VerifyResetOtpBody = { email: string; otp: string }
type ResetPasswordBody = { resetToken: string; newPassword: string }
type ChallengeBody = { tempToken: string; otp: string }
type TempTokenBody = { tempToken: string }

type RegisterResponse = {
  user: UserProfile
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

type AuthSession = {
  accessToken: string
  refreshToken: string
  user: UserProfile
}

type ChallengeResponse = AuthSession

type RefreshResponse = { accessToken: string }

type LoginHistoryRow = {
  id: string
  ip?: string
  userAgent?: string
  createdAt: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiEnvelope<RegisterResponse>, RegisterBody>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<ApiEnvelope<LoginPayload>, LoginBody>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.mutation<
      ApiEnvelope<{ success: boolean }>,
      VerifyEmailBody
    >({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),
    resendVerification: builder.mutation<
      ApiEnvelope<{ success: boolean }>,
      EmailBody
    >({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<
      ApiEnvelope<{ success: boolean }>,
      EmailBody
    >({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resendResetOtp: builder.mutation<
      ApiEnvelope<{ success: boolean }>,
      EmailBody
    >({
      query: (body) => ({
        url: '/auth/resend-reset-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyResetOtp: builder.mutation<
      ApiEnvelope<{ resetToken: string }>,
      VerifyResetOtpBody
    >({
      query: (body) => ({
        url: '/auth/verify-reset-otp',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiEnvelope<{ success: boolean }>,
      ResetPasswordBody
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    sendTwoFactorEmailOtp: builder.mutation<
      ApiEnvelope<{ success: boolean }>,
      TempTokenBody
    >({
      query: (body) => ({
        url: '/auth/2fa/email/send',
        method: 'POST',
        body,
      }),
    }),
    challengeTwoFactor: builder.mutation<
      ApiEnvelope<ChallengeResponse>,
      ChallengeBody
    >({
      query: (body) => ({
        url: '/auth/2fa/challenge',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<
      ApiEnvelope<{ success: boolean }> | ApiEnvelope<null>,
      void
    >({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    refresh: builder.mutation<ApiEnvelope<RefreshResponse>, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    loginHistory: builder.query<ApiEnvelope<LoginHistoryRow[]>, void>({
      query: () => ({
        url: '/auth/me/login-history',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResendResetOtpMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useSendTwoFactorEmailOtpMutation,
  useChallengeTwoFactorMutation,
  useLogoutMutation,
  useRefreshMutation,
  useLoginHistoryQuery,
} = authApi
