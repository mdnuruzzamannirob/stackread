'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'

export type SidebarContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebarOpen')
      if (saved !== null) setIsSidebarOpen(saved === 'true')
    } catch {
      /* ignore (SSR / restricted storage) */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('sidebarOpen', String(isSidebarOpen))
    } catch {
      /* ignore */
    }
  }, [isSidebarOpen])

  const toggleSidebar = useCallback(() => setIsSidebarOpen((s) => !s), [])
  const openSidebar = useCallback(() => setIsSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, openSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarContext
