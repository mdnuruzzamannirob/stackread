import { baseApi } from '@/store/baseApi'
import type { ApiResponse, IUser } from '@/types'

type AuthTokens = {
  accessToken: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  countryCode: string
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterOrLoginResult = {
  user: IUser
  tokens: AuthTokens
}

type ResetPasswordPayload = {
  token: string
  newPassword: string
}

type UpdateMePayload = {
  name?: string
  countryCode?: string
  notificationPreferences?: {
    email?: boolean
    push?: boolean
  }
}

type NotificationPrefsPayload = {
  email?: boolean
  push?: boolean
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      ApiResponse<RegisterOrLoginResult>,
      RegisterPayload
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'UserProfile'],
    }),
    login: builder.mutation<ApiResponse<RegisterOrLoginResult>, LoginPayload>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'UserProfile'],
    }),
    socialCallback: builder.query<ApiResponse<RegisterOrLoginResult>, string>({
      query: (provider) => `/auth/${provider}/callback`,
      providesTags: ['Auth', 'UserProfile'],
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'UserProfile'],
    }),
    verifyEmail: builder.mutation<ApiResponse<null>, { token: string }>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),
    resendVerification: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordPayload>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<ApiResponse<IUser>, void>({
      query: () => '/auth/me',
      providesTags: ['UserProfile'],
    }),
    getMyLoginHistory: builder.query<
      ApiResponse<
        Array<{
          id: string
          ipAddress?: string
          userAgent?: string
          createdAt: string
        }>
      >,
      void
    >({
      query: () => '/auth/me/login-history',
      providesTags: ['UserProfile'],
    }),
    updateMe: builder.mutation<ApiResponse<IUser>, UpdateMePayload>({
      query: (body) => ({
        url: '/auth/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    changeMyPassword: builder.mutation<
      ApiResponse<null>,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/auth/me/password',
        method: 'PATCH',
        body,
      }),
    }),
    updateMyNotificationPreferences: builder.mutation<
      ApiResponse<IUser>,
      NotificationPrefsPayload
    >({
      query: (body) => ({
        url: '/auth/me/notification-prefs',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['UserProfile', 'Notifications'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useSocialCallbackQuery,
  useLazySocialCallbackQuery,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMyLoginHistoryQuery,
  useUpdateMeMutation,
  useChangeMyPasswordMutation,
  useUpdateMyNotificationPreferencesMutation,
} = authApi
