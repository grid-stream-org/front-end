import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define interfaces
interface ContractData {
  id: string
  project_id: string
  contract_threshold: number
  start_date: string
  end_date: string
  status: string
}

interface ProcessedContract {
  id: string
  projectId: string
  offloadAmount: number
  startDate: string
  endDate: string
  status: string
}

interface CurrentContractProps {
  contract: ContractData | null
  isLoading: boolean
}

const CurrentContract = ({ contract, isLoading }: CurrentContractProps) => {
  const activeContract: ProcessedContract | null = contract
    ? {
        id: contract.id,
        projectId: contract.project_id,
        offloadAmount: contract.contract_threshold,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
      }
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Contract</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center">Loading contract details...</div>
        ) : activeContract ? (
          <div className="space-y-3">
            <p>Project ID: {activeContract.projectId}</p>
            <p>Offload Amount: {activeContract.offloadAmount} kW</p>
            <p>Start Date: {activeContract.startDate}</p>
            <p>End Date: {activeContract.endDate}</p>
            <p>Status: {activeContract.status}</p>
          </div>
        ) : (
          <div className="text-center">
            <p>No active contract</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CurrentContract
