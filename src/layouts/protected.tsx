import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { useAuth } from '@/context'

export const Protected = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
