import { baseApi } from '@/store/baseApi'
import type { ApiResponse, IStaff } from '@/types'

type StaffLoginPayload = {
  email: string
  password: string
}

type StaffLoginResult =
  | {
      requiresTwoFactor: false
      accessToken: string
    }
  | {
      requiresTwoFactor: true
      twoFactorToken: string
    }

type VerifyTwoFactorPayload = {
  code: string
}

type VerifyTwoFactorResult = {
  enabled: boolean
  accessToken: string
}

type EnableTwoFactorResult = {
  secret: string
  otpauthUrl?: string
}

type DisableTwoFactorPayload = {
  password: string
  code: string
}

type AcceptInvitePayload = {
  token: string
  password: string
}

export const staffAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    staffLogin: builder.mutation<
      ApiResponse<StaffLoginResult>,
      StaffLoginPayload
    >({
      query: (body) => ({
        url: '/staff/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Staff'],
    }),
    acceptInvite: builder.mutation<
      ApiResponse<{ staff: IStaff; accessToken: string }>,
      AcceptInvitePayload
    >({
      query: (body) => ({
        url: '/staff/accept-invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Staff'],
    }),
    staffLogout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/staff/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Staff'],
    }),
    getStaffMe: builder.query<ApiResponse<IStaff>, void>({
      query: () => '/staff/me',
      providesTags: ['Staff'],
    }),
    changeStaffPassword: builder.mutation<
      ApiResponse<null>,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/staff/me/password',
        method: 'PATCH',
        body,
      }),
    }),
    enableTwoFactor: builder.mutation<ApiResponse<EnableTwoFactorResult>, void>(
      {
        query: () => ({
          url: '/staff/2fa/enable',
          method: 'POST',
        }),
        invalidatesTags: ['Staff'],
      },
    ),
    verifyTwoFactor: builder.mutation<
      ApiResponse<VerifyTwoFactorResult>,
      VerifyTwoFactorPayload
    >({
      query: (body) => ({
        url: '/staff/2fa/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Staff'],
    }),
    disableTwoFactor: builder.mutation<
      ApiResponse<{ enabled: false }>,
      DisableTwoFactorPayload
    >({
      query: (body) => ({
        url: '/staff/2fa/disable',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Staff'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useStaffLoginMutation,
  useAcceptInviteMutation,
  useStaffLogoutMutation,
  useGetStaffMeQuery,
  useLazyGetStaffMeQuery,
  useChangeStaffPasswordMutation,
  useEnableTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
} = staffAuthApi
