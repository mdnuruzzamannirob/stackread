import { cookies } from 'next/headers'

import { env } from '@/lib/env'

export async function getServerAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get(env.sessionCookieName)?.value ?? null
}
