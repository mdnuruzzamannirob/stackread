'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { resolveAuthenticatedDestination } from '@/lib/auth/onboarding'
import {
  clearPersistedTempToken,
  getPersistedTempToken,
} from '@/lib/auth/temp-token'
import { getStoredAccessToken } from '@/lib/auth/token-storage'
import { env } from '@/lib/env'
import {
  clearAuthState,
  clearTempToken,
  setTempToken,
} from '@/store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

async function hasAuthenticatedCookieSession() {
  try {
    const response = await fetch(`${env.apiBaseUrl}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })

    return response.ok
  } catch {
    return false
  }
}

export function useRedirectAuthenticated(locale: string) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const isHydrated = useAppSelector((state) => state.auth.isHydrated)

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const cookieToken = getStoredAccessToken()

    if (!cookieToken) {
      if (token) {
        dispatch(clearAuthState())
      }

      let isMounted = true

      void (async () => {
        const isAuthenticatedByCookie = await hasAuthenticatedCookieSession()

        if (!isMounted || !isAuthenticatedByCookie) {
          return
        }

        const destination = await resolveAuthenticatedDestination({ locale })

        if (!isMounted) {
          return
        }

        router.replace(destination)
      })()

      return () => {
        isMounted = false
      }
    }

    if (!token) {
      return
    }

    let isMounted = true

    void (async () => {
      const destination = await resolveAuthenticatedDestination({
        accessToken: token,
        locale,
      })

      if (!isMounted) {
        return
      }

      if (pathname === destination) {
        return
      }

      router.replace(destination)
    })()

    return () => {
      isMounted = false
    }
  }, [dispatch, isHydrated, locale, pathname, router, token])
}

export function useRequireTempToken(locale: string) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isHydrated = useAppSelector((state) => state.auth.isHydrated)
  const tempToken = useAppSelector((state) => state.auth.tempToken)

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    if (!tempToken) {
      const persisted = getPersistedTempToken()
      if (persisted) {
        dispatch(setTempToken(persisted))
        return
      }

      clearPersistedTempToken()
      dispatch(clearTempToken())
      router.replace(`/${locale}/auth/login`)
    }
  }, [dispatch, isHydrated, locale, router, tempToken])
}
