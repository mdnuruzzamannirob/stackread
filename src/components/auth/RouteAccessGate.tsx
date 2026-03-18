'use client'

import { useAppSelector } from '@/store/hooks'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RouteAccessGateProps = {
  children: React.ReactNode
  requireActor?: 'user' | 'staff'
  guestOnly?: boolean
  allowPaths?: string[]
}

export function RouteAccessGate({
  children,
  requireActor,
  guestOnly = false,
  allowPaths = [],
}: RouteAccessGateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { actorType, hydrationStatus } = useAppSelector((state) => state.auth)

  const allowedPath = allowPaths.includes(pathname)

  useEffect(() => {
    if (hydrationStatus !== 'hydrated') {
      return
    }

    if (allowedPath) {
      return
    }

    if (guestOnly && actorType) {
      router.replace(actorType === 'staff' ? '/admin' : '/dashboard')
      return
    }

    if (requireActor && actorType !== requireActor) {
      const encodedPath = encodeURIComponent(pathname)

      if (requireActor === 'staff') {
        router.replace(`/admin/login?redirect=${encodedPath}`)
      } else {
        router.replace(`/auth/login?redirect=${encodedPath}`)
      }
    }
  }, [
    actorType,
    allowedPath,
    guestOnly,
    hydrationStatus,
    pathname,
    requireActor,
    router,
  ])

  if (hydrationStatus !== 'hydrated') {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Checking session...
      </div>
    )
  }

  if (allowedPath) {
    return <>{children}</>
  }

  if (guestOnly && actorType) {
    return null
  }

  if (requireActor && actorType !== requireActor) {
    return null
  }

  return <>{children}</>
}
