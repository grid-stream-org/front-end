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

interface CurrentContractProps {
  contract: ContractData | null
  isLoading: boolean
}

export const ContractInfoCard = ({ contract, isLoading }: CurrentContractProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Contract</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center">Loading contract details...</div>
        ) : contract ? (
          <div className="space-y-3">
            <p>Project ID: {contract.project_id}</p>
            <p>Offload Amount: {contract.contract_threshold} kW</p>
            <p>Start Date: {contract.start_date}</p>
            <p>End Date: {contract.end_date}</p>
            <p>Status: {contract.status}</p>
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
