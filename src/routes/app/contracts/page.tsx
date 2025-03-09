import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import ContractHistory from './contract-history'
import CurrentContract from './current-contract-chart'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { fetchContracts } from '@/hooks/use-contracts'

const ContractsPage = () => {
  const location = useLocation()
  const { user } = useAuth()
  const [contracts, setContracts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const projectId = user?.projectId

  // Fetch all contracts for this user
  const loadContracts = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const contractsData = await fetchContracts(user)
      setContracts(contractsData)
    } catch (err) {
      setError('Failed to load contracts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadContracts()
    }
  }, [projectId])

  // Find active contract
  const activeContract = contracts.find(contract => contract.status === 'active') || null

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="space-y-6">
        {!projectId ? (
          <div className="text-center text-lg font-semibold">Pending Approval...</div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  )
}

export default ContractsPage
