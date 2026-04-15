import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

import { clearPersistedTempToken } from '@/lib/auth/temp-token'
import {
  clearSession,
  getStoredAccessToken,
  persistSession,
} from '@/lib/auth/token-storage'
import { env } from '@/lib/env'
import {
  clearAuthState,
  setHydratedToken,
} from '@/store/features/auth/authSlice'

const PUBLIC_AUTH_ENDPOINTS = new Set([
  '/auth/register',
  '/auth/login',
  '/auth/2fa/challenge',
  '/auth/2fa/email/send',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/forgot-password',
  '/auth/resend-reset-otp',
  '/auth/verify-reset-otp',
  '/auth/reset-password',
])

const getRequestPath = (args: string | FetchArgs): string => {
  if (typeof args === 'string') {
    return args
  }

  return args.url
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string | null } }
    const token = state.auth?.token ?? getStoredAccessToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const requestPath = getRequestPath(args)
  const shouldSkipRefreshRetry =
    requestPath === '/auth/refresh' || PUBLIC_AUTH_ENDPOINTS.has(requestPath)

  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401 || shouldSkipRefreshRetry) {
    return result
  }

  const refreshResult = await rawBaseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
    },
    api,
    extraOptions,
  )

  if (refreshResult.error) {
    clearSession()
    clearPersistedTempToken()
    api.dispatch(clearAuthState())

    if (typeof window !== 'undefined') {
      const locale =
        window.location.pathname.split('/').filter(Boolean)[0] ||
        env.defaultLocale
      window.location.replace(`/${locale}/auth/login`)
    }

    return result
  }

  const accessToken =
    (refreshResult.data as { data?: { accessToken?: string } } | undefined)
      ?.data?.accessToken ?? null

  if (!accessToken) {
    clearSession()
    clearPersistedTempToken()
    api.dispatch(clearAuthState())

    if (typeof window !== 'undefined') {
      const locale =
        window.location.pathname.split('/').filter(Boolean)[0] ||
        env.defaultLocale
      window.location.replace(`/${locale}/auth/login`)
    }

    return result
  }

  persistSession({ accessToken })
  api.dispatch(setHydratedToken(accessToken))

  result = await rawBaseQuery(args, api, extraOptions)
  return result
}
