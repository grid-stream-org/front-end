import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { MqttProvider, useAuth } from '@/context'

export const Protected = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <MqttProvider>
      <Outlet />
    </MqttProvider>
  )
}
