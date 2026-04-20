import { Providers } from '@/components/providers'
import type { Metadata } from 'next'
import { Source_Sans_3 } from 'next/font/google'
import './globals.css'

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-source-sans-3',
})

export const metadata: Metadata = {
  title: 'Stackread',
  description: 'Stackread frontend portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sourceSans3.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
