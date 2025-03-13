// import { useState, useEffect, useCallback } from 'react'
// import { useLocation } from 'react-router-dom'

// import { DeviceTable } from '../devices/device-table'

// import ContractInfoCard from './contract-card'
// import OffloadHistoryChart from './reduction-history'

// import { PageTitle } from '@/components'
// import { getAppRoute } from '@/config'
// import { useAuth } from '@/context'
// import { useMqttData } from '@/context'
// import { fetchEvents } from '@/hooks/fetch-events'
// import { fetchContracts } from '@/hooks/use-contracts'

// // Define interfaces
// interface ContractData {
//   id: string
//   project_id: string
//   contract_threshold: number
//   start_date: string
//   end_date: string
//   status: string
// }

// const DashboardPage = () => {
//   const location = useLocation()
//   const { user } = useAuth()
//   const [contracts, setContracts] = useState<ContractData[]>([])
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   //const [events, setEvents] = useState<DREvent[]>([])

//   // const [error, setError] = useState<string | null>(null)

//   const projectId = user?.projectId

//   const loadContracts = useCallback(async (): Promise<void> => {
//     if (!user) return

//     setIsLoading(true)
//     try {
//       const contractsData = await fetchContracts(user)
//       setContracts(contractsData)
//     } catch (err) {
//       console.log('Failed to load contracts')
//       console.error(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [user])

//   const loadEvents = useCallback(async (): Promise<void> => {
//     if (!user) return

//     try {
//       const eventsData = await fetchEvents(user)
//       setEvents(eventsData)
//     } catch (err) {
//       console.error('Failed to load events', err)
//     }
//   }, [user])

//   useEffect(() => {
//     if (projectId) {
//       loadContracts()
//     }
//   }, [projectId, loadContracts, loadEvents])

//   // Find active contract
//   const activeContract = contracts.find(contract => contract.status === 'active') || null

//   const { isConnected, devices, error, updateDevice } = useMqttData()

//   return (
//     <>
//       <PageTitle route={getAppRoute(location.pathname)} />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//         <ContractInfoCard contract={activeContract} isLoading={isLoading} error={error} />
//         <DeviceTable
//           devices={devices}
//           isConnected={isConnected}
//           error={error}
//           onUpdatePowerCapacity={updateDevice}
//         />
//         {/* <DemandResponseEvent events={events} />
//         <CalendarCard events={events} /> */}
//         <div className="col-span-1 md:col-span-2">
//           <OffloadHistoryChart />
//         </div>
//       </div>
//     </>
//   )
// }

// export default DashboardPage
