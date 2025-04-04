import { useLocation } from 'react-router-dom'

import { DeviceContributionChart } from './device-contribution-chart'
import { DeviceStatusGrid } from './device-status-grid'
import { MeterChart } from './meter-chart'
import { ReducationChart } from './reduction-chart'
import { SOCChart } from './soc-chart'
import { SummaryStats } from './summary-stats'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useMqttData } from '@/context/mqtt'
import { useMeterData } from '@/hooks'
import { useMeterStore } from '@/state'

const MonitoringPage = () => {
  const location = useLocation()
  const { data } = useMeterStore()
  const { isConnected, error } = useMqttData()
  useMeterData()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} className="items-end">
        <p className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Live Connection' : 'Disconnected'}
        </p>
      </PageTitle>

      <div className="flex flex-col space-y-8">
        <SummaryStats data={data} isConnected={isConnected} error={error} />

        <MeterChart data={data} isConnected={isConnected} error={error} />
        <ReducationChart data={data} isConnected={isConnected} error={error} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <DeviceContributionChart data={data} isConnected={isConnected} error={error} />
          </div>
          <div className="w-full">
            <SOCChart data={data} isConnected={isConnected} error={error} />
          </div>
        </div>
        <div className="w-full">
          <DeviceStatusGrid data={data} isConnected={isConnected} error={error} />
        </div>
      </div>
    </>
  )
}

export default MonitoringPage
