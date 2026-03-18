import { RouteAccessGate } from '@/components/auth/RouteAccessGate'
import { AdminLayout } from '@/components/layouts/AdminLayout'

type AdminRouteLayoutProps = {
  children: React.ReactNode
}

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return (
    <AdminLayout>
      <RouteAccessGate
        requireActor="staff"
        allowPaths={['/admin/login', '/admin/2fa']}
      >
        {children}
      </RouteAccessGate>
    </AdminLayout>
  )
}
