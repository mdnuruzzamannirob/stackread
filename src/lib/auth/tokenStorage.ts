type TokenRecord = {
  token: string
  expiresAt: number
}

let userTokenRecord: TokenRecord | null = null
let staffTokenRecord: TokenRecord | null = null

function getRecordKey(actorType: 'user' | 'staff') {
  return actorType === 'user' ? 'stackread_user_token' : 'stackread_staff_token'
}

function getCookieKey(actorType: 'user' | 'staff') {
  return actorType === 'user'
    ? 'stackread_user_access_token'
    : 'stackread_staff_access_token'
}

function decodeJwtExpiry(token: string): number | null {
  try {
    const parts = token.split('.')

    if (parts.length < 2) {
      return null
    }

    const payload = JSON.parse(atob(parts[1])) as { exp?: number }

    if (!payload.exp || typeof payload.exp !== 'number') {
      return null
    }

    return payload.exp * 1000
  } catch {
    return null
  }
}

function setAuthCookie(
  actorType: 'user' | 'staff',
  token: string,
  expiresAt: number,
) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${getCookieKey(actorType)}=${encodeURIComponent(token)}; path=/; expires=${new Date(expiresAt).toUTCString()}; SameSite=Lax`
}

function clearAuthCookie(actorType: 'user' | 'staff') {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${getCookieKey(actorType)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
}

function parseStoredRecord(value: string | null): TokenRecord | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as TokenRecord

    if (!parsed?.token || !parsed?.expiresAt) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function persistRecord(
  actorType: 'user' | 'staff',
  record: TokenRecord | null,
) {
  if (typeof window === 'undefined') {
    return
  }

  const key = getRecordKey(actorType)

  if (!record) {
    window.localStorage.removeItem(key)
    return
  }

  window.localStorage.setItem(key, JSON.stringify(record))
}

export function setAccessToken(
  actorType: 'user' | 'staff',
  token: string,
  expiresAt?: number,
) {
  const computedExpiry =
    expiresAt ?? decodeJwtExpiry(token) ?? Date.now() + 24 * 60 * 60 * 1000
  const record = { token, expiresAt: computedExpiry }

  if (actorType === 'user') {
    userTokenRecord = record
  } else {
    staffTokenRecord = record
  }

  persistRecord(actorType, record)
  setAuthCookie(actorType, token, computedExpiry)
}

export function getAccessToken(actorType: 'user' | 'staff') {
  const inMemory = actorType === 'user' ? userTokenRecord : staffTokenRecord

  if (inMemory) {
    return inMemory.token
  }

  if (typeof window === 'undefined') {
    return null
  }

  const fromStorage = parseStoredRecord(
    window.localStorage.getItem(getRecordKey(actorType)),
  )

  if (!fromStorage) {
    return null
  }

  if (Date.now() >= fromStorage.expiresAt) {
    clearAccessToken(actorType)
    return null
  }

  if (actorType === 'user') {
    userTokenRecord = fromStorage
  } else {
    staffTokenRecord = fromStorage
  }

  return fromStorage.token
}

export function getAccessTokenExpiry(actorType: 'user' | 'staff') {
  const inMemory = actorType === 'user' ? userTokenRecord : staffTokenRecord

  if (inMemory) {
    return inMemory.expiresAt
  }

  if (typeof window === 'undefined') {
    return null
  }

  const fromStorage = parseStoredRecord(
    window.localStorage.getItem(getRecordKey(actorType)),
  )
  return fromStorage?.expiresAt ?? null
}

export function isAccessTokenExpired(actorType: 'user' | 'staff') {
  const expiresAt = getAccessTokenExpiry(actorType)

  if (!expiresAt) {
    return true
  }

  return Date.now() >= expiresAt
}

export function clearAccessToken(actorType: 'user' | 'staff') {
  if (actorType === 'user') {
    userTokenRecord = null
  } else {
    staffTokenRecord = null
  }

  persistRecord(actorType, null)
  clearAuthCookie(actorType)
}

export function clearAllAccessTokens() {
  clearAccessToken('user')
  clearAccessToken('staff')
}
