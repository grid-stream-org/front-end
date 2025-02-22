import { useLocation } from 'react-router-dom'

import { DeviceTable } from './device-table'
import { SummaryCards } from './summary-cards'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useMqttData } from '@/context'

const DevicesPage = () => {
  const location = useLocation()
  const { isConnected, devices, error, updateDevice } = useMqttData()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      {/* TODO I made a generic summary-cards component that might be able to be used here but I don't have a good test account to test it */}
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
