import { useLocation } from 'react-router-dom'

import { DeviceTable } from '../devices/device-table'

import ContractInfoCard from './contract-card'
import CalendarCard from './dr-calendar'
import DemandResponseEvent from './dr-events'
import OffloadHistoryChart from './reduction-history'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'

const DashboardPage = () => {
  const location = useLocation()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <ContractInfoCard />
        <DeviceTable />
        <DemandResponseEvent />
        <CalendarCard />
        <div className="col-span-1 md:col-span-2">
          <OffloadHistoryChart />
        </div>
      </div>
    </>
  )
}

export default DashboardPage
