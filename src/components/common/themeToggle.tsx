'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const darkMode = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Switch theme"
      onClick={() => setTheme(darkMode ? 'light' : 'dark')}
    >
      {mounted ? (
        darkMode ? (
          <Sun />
        ) : (
          <Moon />
        )
      ) : (
        <span aria-hidden="true" className="inline-block w-6 h-6" />
      )}
    </Button>
  )
}
