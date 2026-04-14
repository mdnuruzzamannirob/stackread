import { env } from '@/lib/env'

type ServerRequestOptions = {
  path: string
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  token?: string
  body?: unknown
  cache?: RequestCache
}

export async function serverApiRequest<T>({
  path,
  method = 'GET',
  token,
  body,
  cache = 'no-store',
}: ServerRequestOptions): Promise<T | null> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    cache,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    return null
  }

  const json = (await response.json()) as { data?: T }
  return json.data ?? null
}
