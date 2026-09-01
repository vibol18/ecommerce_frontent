import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <>{children}</>
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const isAdmin = useAuthStore((s) => s.isAdmin)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}