import { useLocation } from 'react-router-dom'

import { DeviceTable } from './device-table'
import { SummaryCards } from './summary-cards'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useMqttData } from '@/context/mqtt'

const DevicesPage = () => {
  const location = useLocation()
  const { isConnected, devices, error, updateDevice } = useMqttData()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <SummaryCards devices={devices} isConnected={isConnected} />
      <DeviceTable
        devices={devices}
        isConnected={isConnected}
        error={error}
        onUpdatePowerCapacity={updateDevice}
      />
    </>
  )
}

export default DevicesPage
