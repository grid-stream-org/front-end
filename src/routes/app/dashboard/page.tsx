import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { ContractInfoCard } from './contract-card'
import { CalendarCard } from './dr-calendar'
import { DemandResponseEvent } from './dr-events'
import OffloadHistoryChart from './reduction-history'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { useMqttData } from '@/context'
import { fetchEvents, fetchContracts } from '@/hooks' // Changed from useEvents to fetchEvents
import { DeviceTable } from '@/routes/app/devices/device-table'
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
  // const [error, setError] = useState<string | null>(null)

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
      // Use fetchEvents instead of useEvents
      const eventsData = await fetchEvents(user)
      setEvents(eventsData)
    } catch (err) {
      console.error('Failed to load events', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadContracts()
    loadEvents() // Call loadEvents in the useEffect
  }, [loadContracts, loadEvents])

  // Find active contract
  const activeContract = contracts.find(contract => contract.status === 'active') || null
  const { isConnected, devices, error, updateDevice } = useMqttData()

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <ContractInfoCard contract={activeContract} isLoading={isLoading} />
        <DeviceTable
          devices={devices}
          isConnected={isConnected}
          error={error}
          onUpdatePowerCapacity={updateDevice}
        />
        <DemandResponseEvent events={events} />
        <CalendarCard events={events} />
        <div className="col-span-1 md:col-span-2">
          <OffloadHistoryChart />
        </div>
      </div>
    </>
  )
}

export default DashboardPage
