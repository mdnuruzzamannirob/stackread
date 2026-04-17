export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  meta?: Record<string, unknown>
}

export type ApiPaginationMeta = {
  page: number
  limit: number
  total: number
  pages: number
}

export type ApiListParams = {
  page?: number
  limit?: number
}

export type ApiSortOrder = 'asc' | 'desc'

export type ApiErrorEnvelope = {
  success: false
  message: string
  code?: string
  errors?: Array<{ field?: string; message?: string }>
  data?: unknown
}
