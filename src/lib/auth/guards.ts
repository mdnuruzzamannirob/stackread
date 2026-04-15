'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { resolveAuthenticatedDestination } from '@/lib/auth/onboarding'
import { getStoredAccessToken } from '@/lib/auth/token-storage'
import { clearAuthState } from '@/store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

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
      return
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
  const isHydrated = useAppSelector((state) => state.auth.isHydrated)
  const tempToken = useAppSelector((state) => state.auth.tempToken)

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    if (!tempToken) {
      router.replace(`/${locale}/auth/login`)
    }
  }, [isHydrated, locale, router, tempToken])
}
