import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import ContractHistory from './contract-history'
import CurrentContract from './current-contract-chart'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { fetchContracts } from '@/hooks/use-contracts'

// Define interfaces
interface ContractData {
  id: string
  project_id: string
  contract_threshold: number
  start_date: string
  end_date: string
  status: string
}

const ContractsPage = () => {
  const location = useLocation()
  const { user } = useAuth()
  const [contracts, setContracts] = useState<ContractData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const projectId = user?.projectId

  const loadContracts = useCallback(async (): Promise<void> => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const contractsData = await fetchContracts(user)
      setContracts(contractsData)
    } catch (err) {
      setError('Failed to load contracts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (projectId) {
      loadContracts()
    }
  }, [projectId, loadContracts])

  // Find active contract
  const activeContract = contracts.find(contract => contract.status === 'active') || null

  if (!projectId) {
    return (
      <>
        <PageTitle route={getAppRoute(location.pathname)} />
        <div className="flex items-center justify-center h-40 rounded-lg border bg-card shadow-sm">
          <p className="text-muted-foreground">Pending Approval...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="grid gap-6">
        <CurrentContract
          contract={activeContract}
          isLoading={isLoading}
          onContractCreated={loadContracts}
          baselineOffload={50}
        />
        <ContractHistory
          contracts={contracts}
          isLoading={isLoading}
          onContractDeleted={loadContracts}
          error={error}
        />
      </div>
    </>
  )
}

export default ContractsPage
