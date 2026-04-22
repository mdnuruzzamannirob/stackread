'use client'

import { clearPersistedTempToken } from '@/lib/auth/temp-token'
import { clearSession, persistSession } from '@/lib/auth/token-storage'
import type { AppDispatch } from '@/store'
import {
  clearAuthState,
  clearTempToken,
  setAuthenticatedSession,
} from '@/store/features/auth/authSlice'
import type { UserProfile } from '@/store/features/auth/types'

type ApplySessionPayload = {
  accessToken?: string
  token?: string
  refreshToken?: string
  user: UserProfile
}

export function applyAuthenticatedSession(
  dispatch: AppDispatch,
  payload: ApplySessionPayload,
) {
  const accessToken = payload.accessToken ?? payload.token

  if (!accessToken) {
    throw new Error('Missing access token.')
  }

  persistSession({
    accessToken,
    refreshToken: payload.refreshToken,
  })
  clearPersistedTempToken()
  dispatch(clearTempToken())
  dispatch(
    setAuthenticatedSession({
      token: accessToken,
      user: payload.user,
    }),
  )
}

export function clearClientAuthSession(dispatch: AppDispatch) {
  clearSession()
  clearPersistedTempToken()
  dispatch(clearAuthState())
}
