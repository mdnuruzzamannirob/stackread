'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'

import { getStoredAccessToken } from '@/lib/auth/token-storage'
import { store } from '@/store'
import { setHydratedToken } from '@/store/features/auth/authSlice'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = getStoredAccessToken()
    store.dispatch(setHydratedToken(token))
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          richColors
          duration={3000}
          swipeDirections={['bottom', 'left', 'right', 'top']}
          position="top-center"
          expand

        />
      </ThemeProvider>
    </Provider>
  )
}
