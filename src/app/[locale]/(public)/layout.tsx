import { PublicFooter } from '@/components/layout/publicFooter'
import { PublicNavbar } from '@/components/layout/publicNavbar'

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar locale={locale} />
      <main className="flex-1">{children}</main>
      <PublicFooter locale={locale} />
    </div>
  )
}
