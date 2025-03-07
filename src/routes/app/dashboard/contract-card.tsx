import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ContractInfoCard = () => {
  const contract = {
    projectID: 'DER2G-2025-001',
    offloadAmount: '50 kW',
    utilityProvider: 'GridStream Energy',
    endDate: '2025-12-31',
    active: true,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Information</CardTitle>
      </CardHeader>
      <CardContent>
        {contract.active ? (
          <div className="space-y-2">
            <p>
              <strong>Project ID:</strong> {contract.projectID}
            </p>
            <p>
              <strong>Offload Amount:</strong> {contract.offloadAmount}
            </p>
            <p>
              <strong>Utility Provider:</strong> {contract.utilityProvider}
            </p>
            <p>
              <strong>End Date:</strong> {contract.endDate}
            </p>
          </div>
        ) : (
          <p>No active contract</p>
        )}
      </CardContent>
    </Card>
  )
}

export default ContractInfoCard
