import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { MeterChart } from '../monitoring/meter-chart'

import { ContractInfoCard } from './contract-card'
import { CalendarCard } from './dr-calendar'
import { DemandResponseEvent } from './dr-events'
import { PowerConsumptionGauge } from './power-gauge'
import { OffloadHistoryChart } from './reduction-history'
import { FinancialImpactCard } from './test'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { useMqttData } from '@/context/mqtt'
import { fetchEvents, fetchContracts } from '@/hooks'
import { DeviceTable } from '@/routes/app/devices/device-table'
import { useMeterStore } from '@/state'
import { DREvent } from '@/types'

// Define interfaces
interface ContractData {
  id: string
  project_id: string
  contract_threshold: number
  start_date: string
  end_date: string
  status: string
}

const DashboardPage = () => {
  const location = useLocation()
  const { user } = useAuth()
  const [contracts, setContracts] = useState<ContractData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [events, setEvents] = useState<DREvent[]>([])

  const loadContracts = useCallback(async (): Promise<void> => {
    if (!user) return
    setIsLoading(true)
    try {
      const contractsData = await fetchContracts(user)
      setContracts(contractsData)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const loadEvents = useCallback(async (): Promise<void> => {
    if (!user) return
    setIsLoading(true)
    try {
      const eventsData = await fetchEvents(user, 'Residential')
      setEvents(eventsData)
    } catch (err) {
      console.error('Failed to load events', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadContracts()
    loadEvents()
  }, [loadContracts, loadEvents])

  // Find active contract
  const activeContract = contracts.find(contract => contract.status === 'active') || null
  const { isConnected, devices, error, updateDevice } = useMqttData()
  const { data } = useMeterStore()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PowerConsumptionGauge data={data} isConnected error={error} />

        <FinancialImpactCard data={data} events={events} />
        <div className="col-span-1 lg:col-span-2">
          <DemandResponseEvent events={events} />
        </div>
        <ContractInfoCard contract={activeContract} isLoading={isLoading} />

        <MeterChart isConnected error={error} data={data} />

        <DeviceTable
          devices={devices}
          isConnected={isConnected}
          error={error}
          onUpdatePowerCapacity={updateDevice}
        />

        <CalendarCard events={events} />
        <div className="col-span-1 lg:col-span-2">
          <OffloadHistoryChart events={events} />
        </div>
      </div>
    </>
  )
}

export default DashboardPage
