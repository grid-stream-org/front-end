import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { MqttProvider, useAuth } from '@/context'
import { useMeterData } from '@/hooks'

const ReadMqttData = () => {
  useMeterData()
  return null
}

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
      <ReadMqttData />
      <Outlet />
    </MqttProvider>
  )
}
