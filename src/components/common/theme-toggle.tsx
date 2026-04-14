'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const darkMode = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Switch theme"
      onClick={() => setTheme(darkMode ? 'light' : 'dark')}
    >
      {darkMode ? <Sun /> : <Moon />}
    </Button>
  )
}
