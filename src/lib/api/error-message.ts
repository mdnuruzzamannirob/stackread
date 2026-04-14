export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
) {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const maybeData = (error as { data?: { message?: string } }).data
  if (maybeData?.message) {
    return maybeData.message
  }

  const maybeMessage = (error as { message?: string }).message
  if (maybeMessage) {
    return maybeMessage
  }

  return fallback
}
