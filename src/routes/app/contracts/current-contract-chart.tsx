import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context'
import { createContract } from '@/hooks/use-contracts'

const CurrentContract = ({
  contract,
  onContractCreated,
  baselineOffload = 100, // NEED TO GET THIS FROM API
}) => {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [offloadAmount, setOffloadAmount] = useState(baselineOffload)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date()
  const currentDateTime = today.toISOString().split('T')[0]

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newContract = {
        offloadAmount,
        projectId: user.projectId,
      }

      const result = await createContract(user, newContract)

      if (result) {
        setIsModalOpen(false)
        if (onContractCreated) {
          onContractCreated() // Refresh the contracts list
        }
      } else {
        setError('Failed to create contract')
      }
    } catch (err) {
      console.error(`Failed to fetch contracts: Status ${err}`)
      setError('Error creating contract')
    } finally {
      setIsLoading(false)
    }
  }

  // Process contract data if available
  const activeContract = contract
    ? {
        id: contract.id,
        projectId: contract.project_id,
        offloadAmount: contract.contract_threshold,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
      }
    : null

  const isPending = activeContract?.status === 'pending'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Contract</CardTitle>
      </CardHeader>
      <CardContent>
        {activeContract ? (
          <div className="space-y-3">
            <p>Project ID: {activeContract.projectId}</p>
            <p>Offload Amount: {activeContract.offloadAmount} kW</p>
            <p>Start Date: {activeContract.startDate}</p>
            <p>End Date: {activeContract.endDate}</p>
            <p>Status: {isPending ? 'Pending Approval' : activeContract.status}</p>
            {!isPending && (
              <Button
                variant="destructive"
                onClick={() => {
                  // Handle termination through parent component
                  if (onContractCreated) {
                    onContractCreated()
                  }
                }}
              >
                Terminate Contract
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p>No active contract</p>
            <Button className="mt-2 text-white" onClick={() => setIsModalOpen(true)}>
              Engage in a Contract
            </Button>
          </div>
        )}

        {error && <div className="mt-2 text-red-500">{error}</div>}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Engage in a New Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={currentDateTime} disabled />
            </div>
            <div>
              <Label>Offload Amount (kW)</Label>
              <p className="text-muted-foreground text-sm">
                Max Offload Capability: {baselineOffload} kW
              </p>
              <Input
                type="number"
                min="0"
                max={baselineOffload}
                value={offloadAmount}
                onChange={e => setOffloadAmount(Number(e.target.value))}
              />
              {offloadAmount > baselineOffload && (
                <p className="text-red-500 text-sm">Offload amount exceeds max allowed</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="text-white"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              onClick={handleSubmit}
              disabled={isLoading || offloadAmount > baselineOffload || offloadAmount <= 0}
            >
              {isLoading ? 'Creating...' : 'Confirm Contract'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default CurrentContract
