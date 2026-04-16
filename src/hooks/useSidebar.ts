'use client'

import SidebarContext, { SidebarContextType } from '@/contexts/SidebarProvider'
import { useContext } from 'react'

const useSidebar = (): SidebarContextType => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
export default useSidebar
