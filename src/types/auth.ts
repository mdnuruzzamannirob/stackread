export type RolePermissionMap = Record<string, boolean>

export interface IUser {
  id: string
  email: string
  name: string
  countryCode?: string
  provider?: 'local' | 'google' | 'facebook'
  role?: string
  permissions?: string[]
  isEmailVerified: boolean
  isOnboardingCompleted?: boolean
  notificationPreferences?: {
    email: boolean
    push: boolean
  }
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface IStaff {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  twoFactorEnabled: boolean
  isSuperAdmin?: boolean
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface UserJwtPayload {
  sub: string
  email: string
  actorType: 'user'
  exp: number
  iat: number
}

export interface StaffJwtPayload {
  sub: string
  email: string
  actorType: 'staff'
  role: string
  permissions: string[]
  exp: number
  iat: number
}
