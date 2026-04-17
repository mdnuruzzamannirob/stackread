export type QueryPrimitive = string | number | boolean

export type QueryValue =
  | QueryPrimitive
  | null
  | undefined
  | Array<QueryPrimitive | null | undefined>

export type QueryParams = Record<string, QueryValue>

const appendEntry = (
  searchParams: URLSearchParams,
  key: string,
  value: QueryPrimitive | null | undefined,
) => {
  if (value === null || typeof value === 'undefined') {
    return
  }

  searchParams.append(key, String(value))
}

export const buildQueryString = (params?: QueryParams) => {
  if (!params) {
    return ''
  }

  const searchParams = new URLSearchParams()

  for (const [key, rawValue] of Object.entries(params)) {
    if (Array.isArray(rawValue)) {
      rawValue.forEach((item) => appendEntry(searchParams, key, item))
      continue
    }

    appendEntry(searchParams, key, rawValue)
  }

  return searchParams.toString()
}

export const withQuery = (path: string, params?: QueryParams) => {
  const query = buildQueryString(params)

  if (!query) {
    return path
  }

  return `${path}?${query}`
}
