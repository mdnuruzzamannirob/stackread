import {
  clearAccessToken,
  clearAllAccessTokens,
  getAccessToken,
  setAccessToken as persistAccessToken,
} from '@/lib/auth/tokenStorage'
import {
  resetAuthState,
  setAccessToken,
  setActorType,
  setCurrentActor,
  setHydrationStatus,
  setOnboardingStatus,
  setPendingTwoFactorToken,
  setPermissionMap,
  setRoles,
  type AuthState,
} from '@/store/features/auth/authSlice'
import type { IStaff, IUser } from '@/types'

type AuthDispatch = (action: unknown) => void

function toPermissionMap(permissions: string[] | undefined) {
  if (!permissions?.length) {
    return {}
  }

  return permissions.reduce<Record<string, boolean>>((acc, permission) => {
    acc[permission] = true
    return acc
  }, {})
}

export function clearAuthSession(dispatch: AuthDispatch) {
  clearAllAccessTokens()
  dispatch(resetAuthState())
  dispatch(setHydrationStatus('hydrated'))
}

export function startHydration(dispatch: AuthDispatch) {
  dispatch(setHydrationStatus('hydrating'))
}

export function finishHydration(dispatch: AuthDispatch) {
  dispatch(setHydrationStatus('hydrated'))
}

export function applyPendingTwoFactorSession(
  dispatch: AuthDispatch,
  token: string,
) {
  persistAccessToken('staff', token)
  clearAccessToken('user')
  dispatch(setPendingTwoFactorToken(token))
  dispatch(setActorType(null))
  dispatch(setAccessToken(null))
  dispatch(setCurrentActor(null))
  dispatch(setRoles([]))
  dispatch(setPermissionMap({}))
}

export function applyUserSession(
  dispatch: AuthDispatch,
  payload: {
    token: string
    user: IUser
    onboardingStatus?: AuthState['onboardingStatus']
  },
) {
  persistAccessToken('user', payload.token)
  clearAccessToken('staff')

  dispatch(setActorType('user'))
  dispatch(setPendingTwoFactorToken(null))
  dispatch(setAccessToken(payload.token))
  dispatch(setCurrentActor(payload.user))
  dispatch(setRoles(payload.user.role ? [payload.user.role] : []))
  dispatch(setPermissionMap(toPermissionMap(payload.user.permissions)))

  if (payload.onboardingStatus) {
    dispatch(setOnboardingStatus(payload.onboardingStatus))
  }
}

export function applyStaffSession(
  dispatch: AuthDispatch,
  payload: {
    token: string
    staff: IStaff
  },
) {
  persistAccessToken('staff', payload.token)
  clearAccessToken('user')

  dispatch(setActorType('staff'))
  dispatch(setPendingTwoFactorToken(null))
  dispatch(setAccessToken(payload.token))
  dispatch(setCurrentActor(payload.staff))
  dispatch(setRoles(payload.staff.role ? [payload.staff.role] : []))
  dispatch(setPermissionMap(toPermissionMap(payload.staff.permissions)))
  dispatch(setOnboardingStatus('unknown'))
}

export function getExistingSessionTokens() {
  const userToken = getAccessToken('user')
  const staffToken = getAccessToken('staff')

  return {
    userToken,
    staffToken,
  }
}
