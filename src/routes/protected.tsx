import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/context'

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader2 />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
