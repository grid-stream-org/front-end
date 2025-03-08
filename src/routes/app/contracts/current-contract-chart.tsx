import { useState, useEffect } from 'react'

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
import { createContract, fetchContractById, deleteContract } from '@/hooks/use-contracts'

const CurrentContract = ({
  onContractCreated,
  baselineOffload = 100, // NEED TO GET THIS FROM API
}) => {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [offloadAmount, setOffloadAmount] = useState(baselineOffload)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [contract, setContract] = useState(null)
  const [isLoadingContract, setIsLoadingContract] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false) // For confirmation dialog
  const [confirmationProjectId, setConfirmationProjectId] = useState('') // Store project ID for confirmation

  const today = new Date()
  const currentDateTime = today.toISOString().split('T')[0]

  const contractId = '03e21f6c-1663-4d2c-a2fd-6154aa723d1f'

  // Fetch contract data when contractId changes
  useEffect(() => {
    const getContract = async () => {
      if (contractId) {
        setIsLoadingContract(true)
        try {
          const contractData = await fetchContractById(contractId)
          setContract(contractData)
        } catch (err) {
          console.error('Error fetching contract:', err)
          setError('Failed to load contract details')
        } finally {
          setIsLoadingContract(false)
        }
      }
    }

    getContract()
  }, [contractId])

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
        const fetchedContract = await fetchContractById(contractId) // Replace with your API call

        if (fetchedContract) {
          setIsModalOpen(false)
          setContract(fetchedContract) // Update the local state with the fetched contract details

          if (onContractCreated) {
            onContractCreated(fetchedContract) // Pass the new contract to parent
          }
        } else {
          setError('Failed to fetch contract details')
        }
      } else {
        setError('Failed to create contract')
      }
    } catch (err) {
      console.error('Error creating contract:', err)
      setError('Error creating contract')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTerminate = () => {
    // Open confirmation dialog
    setIsConfirmationOpen(true)
  }

  const handleConfirmTermination = async () => {
    if (confirmationProjectId !== user.projectId) {
      setError('Project ID does not match. Cannot terminate contract.')
      return
    }

    setIsLoading(true)

    try {
      const success = await deleteContract(user, contract.id)

      if (success) {
        setIsConfirmationOpen(false) // Close confirmation dialog
        setContract(null) // Clear contract data as it's terminated
        if (onContractCreated) {
          onContractCreated() // Notify parent if needed
        }
      } else {
        setError('Failed to terminate contract')
      }
    } catch (err) {
      console.error('Error terminating contract:', err)
      setError('Error terminating contract')
    } finally {
      setIsLoading(false)
    }
  }

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
        {isLoadingContract ? (
          <div className="text-center">Loading contract details...</div>
        ) : activeContract ? (
          <div className="space-y-3">
            <p>Project ID: {activeContract.projectId}</p>
            <p>Offload Amount: {activeContract.offloadAmount} kW</p>
            <p>Start Date: {activeContract.startDate}</p>
            <p>End Date: {activeContract.endDate}</p>
            <p>Status: {isPending ? 'Pending Approval' : activeContract.status}</p>
            {!isPending && (
              <Button variant="destructive" onClick={handleTerminate}>
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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Contract Termination for Project: <br />
              <span className="text-sm text-muted-foreground">{user.projectId}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Enter Project ID to Confirm Termination</Label>
              <Input
                type="text"
                value={confirmationProjectId}
                onChange={e => setConfirmationProjectId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="text-white"
              onClick={() => setIsConfirmationOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              onClick={handleConfirmTermination}
              disabled={isLoading || confirmationProjectId !== user.projectId}
            >
              {isLoading ? 'Terminating...' : 'Confirm Termination'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
