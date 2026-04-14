export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  meta?: Record<string, unknown>
}

export type ApiErrorEnvelope = {
  success: false
  message: string
  code?: string
  errors?: Array<{ field?: string; message?: string }>
  data?: unknown
}
