'use client'

import {
  applyStaffSession,
  applyUserSession,
  clearAuthSession,
  finishHydration,
  getExistingSessionTokens,
  startHydration,
} from '@/lib/auth/session'
import { useLazyGetMeQuery } from '@/store/features/auth/authApi'
import { setOnboardingStatus } from '@/store/features/auth/authSlice'
import { useLazyGetOnboardingStatusQuery } from '@/store/features/onboarding/onboardingApi'
import { useLazyGetStaffMeQuery } from '@/store/features/staffAuth/staffAuthApi'
import { useAppDispatch } from '@/store/hooks'
import { useEffect } from 'react'

export function AuthHydrator() {
  const dispatch = useAppDispatch()
  const [triggerGetMe] = useLazyGetMeQuery()
  const [triggerGetStaffMe] = useLazyGetStaffMeQuery()
  const [triggerGetOnboardingStatus] = useLazyGetOnboardingStatusQuery()

  useEffect(() => {
    let cancelled = false

    const hydrateAuth = async () => {
      startHydration(dispatch)

      const { userToken, staffToken } = getExistingSessionTokens()

      if (!userToken && !staffToken) {
        finishHydration(dispatch)
        return
      }

      try {
        if (staffToken) {
          const staffResponse = await triggerGetStaffMe(
            undefined,
            true,
          ).unwrap()

          if (cancelled) {
            return
          }

          applyStaffSession(dispatch, {
            token: staffToken,
            staff: staffResponse.data,
          })

          finishHydration(dispatch)
          return
        }

        if (userToken) {
          const meResponse = await triggerGetMe(undefined, true).unwrap()

          let onboardingStatus: 'required' | 'completed' = 'completed'

          try {
            const onboardingResponse = await triggerGetOnboardingStatus(
              undefined,
              true,
            ).unwrap()
            onboardingStatus = onboardingResponse.data?.isOnboardingCompleted
              ? 'completed'
              : 'required'
          } catch {
            if (meResponse.data.isOnboardingCompleted === false) {
              onboardingStatus = 'required'
            }
          }

          if (cancelled) {
            return
          }

          applyUserSession(dispatch, {
            token: userToken,
            user: meResponse.data,
            onboardingStatus,
          })
          dispatch(setOnboardingStatus(onboardingStatus))
        }
      } catch {
        if (!cancelled) {
          clearAuthSession(dispatch)
          return
        }
      }

      if (!cancelled) {
        finishHydration(dispatch)
      }
    }

    void hydrateAuth()

    return () => {
      cancelled = true
    }
  }, [dispatch, triggerGetMe, triggerGetOnboardingStatus, triggerGetStaffMe])

  return null
}
