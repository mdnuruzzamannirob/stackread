import { RouteAccessGate } from '@/components/auth/RouteAccessGate'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

type DashboardRouteLayoutProps = {
  children: React.ReactNode
}

export default function DashboardRouteLayout({
  children,
}: DashboardRouteLayoutProps) {
  return (
    <DashboardLayout>
      <RouteAccessGate requireActor="user">{children}</RouteAccessGate>
    </DashboardLayout>
  )
}
