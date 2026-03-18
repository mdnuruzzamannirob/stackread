'use client'

import { AuthHydrator } from '@/components/providers/AuthHydrator'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <AuthHydrator />
        {children}
      </ReduxProvider>
    </ThemeProvider>
  )
}
