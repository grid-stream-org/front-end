import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { MqttProvider, useAuth } from '@/context'
import { UserRole } from '@/types'

export const Protected = () => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (location.pathname.startsWith('/app/utility/') && user.role !== UserRole.UTILITY) {
    return <Navigate to={`/app/${location.pathname.split('/app/utility/')[1]}`} replace />
  }

  if (!location.pathname.includes('/utility/') && user.role === UserRole.UTILITY) {
    return <Navigate to={`/app/utility/${location.pathname.split('/app/')[1]}`} replace />
  }

  return (
    <MqttProvider>
      <Outlet />
    </MqttProvider>
  )
}
