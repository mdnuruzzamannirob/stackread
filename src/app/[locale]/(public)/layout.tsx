import { PublicNavbar } from '@/components/layout/public-navbar'

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar locale={locale} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
    </div>
  )
}
