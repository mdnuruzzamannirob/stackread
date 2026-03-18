import { clearAllAccessTokens, getAccessToken } from '@/lib/auth/tokenStorage'
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    const userToken = getAccessToken('user')
    const staffToken = getAccessToken('staff')
    const token = staffToken ?? userToken

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  },
})

let refreshInFlight: Promise<boolean> | null = null

function resolveRedirectPath(pathname: string) {
  return pathname.startsWith('/admin') ? '/admin/login' : '/auth/login'
}

function buildRedirectUrl(pathname: string) {
  const loginPath = resolveRedirectPath(pathname)

  if (pathname === '/auth/login' || pathname === '/admin/login') {
    return loginPath
  }

  const encoded = encodeURIComponent(pathname)
  return `${loginPath}?redirect=${encoded}`
}

async function attemptRefresh(
  api: Parameters<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
  >[1],
  extraOptions: Parameters<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
  >[2],
): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const staffToken = getAccessToken('staff')
      const refreshRoute = staffToken ? '/staff/refresh' : '/auth/refresh'
      const refreshResult = await rawBaseQuery(
        {
          url: refreshRoute,
          method: 'POST',
        },
        api,
        extraOptions,
      )

      if (refreshResult.error) {
        return false
      }

      return true
    })()
  }

  const success = await refreshInFlight
  refreshInFlight = null
  return success
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    const refreshed = await attemptRefresh(api, extraOptions)

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions)
    }

    if (result.error?.status === 401) {
      clearAllAccessTokens()

      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname
        window.location.assign(buildRedirectUrl(pathname))
      }
    }
  }

  if (result.error?.status === 403 && typeof window !== 'undefined') {
    const pathname = window.location.pathname

    if (pathname.startsWith('/admin')) {
      window.location.assign('/admin')
    } else if (pathname.startsWith('/dashboard')) {
      window.location.assign('/dashboard')
    }
  }

  return result
}
