import { useLocation } from 'react-router-dom'

import ContractHistory from './contract-history'
import CurrentContract from './current-contract-chart'

import { PageTitle } from '@/components'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'

const ContractsPage = () => {
  const location = useLocation()
  const { user } = useAuth()

  const projectId = user?.projectId

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <div className="space-y-6">
        {!projectId ? (
          <div className="text-center text-lg font-semibold">Pending Approval...</div>
        ) : (
          <>
            <CurrentContract />
            <ContractHistory />
          </>
        )}
      </div>
    </>
  )
}

export default ContractsPage
