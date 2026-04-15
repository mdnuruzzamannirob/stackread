import { redirect } from 'next/navigation'

export default async function PaymentSuccessRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === 'string') {
      query.set(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item))
    }
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  redirect(`/${locale}/onboarding/success${suffix}`)
}
