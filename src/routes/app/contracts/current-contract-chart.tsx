import {
  FileText,
  Zap,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PlusCircle,
} from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context'
import { createContract, deleteContract } from '@/hooks/use-contracts'

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

interface NewContract {
  offloadAmount: number
  projectId: string
}

interface CurrentContractProps {
  contract: ContractData | null
  isLoading: boolean
  onContractCreated?: () => void
  baselineOffload?: number
}

const CurrentContract = ({
  contract,
  isLoading: isLoadingContract,
  onContractCreated,
  baselineOffload = 50,
}: CurrentContractProps) => {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [offloadAmount, setOffloadAmount] = useState<number>(baselineOffload)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [confirmationProjectId, setConfirmationProjectId] = useState<string>('')

  const today = new Date()
  const currentDateTime = today.toISOString().split('T')[0]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const newContract: NewContract = {
        offloadAmount,
        projectId: user!.projectId,
      }

      const result = await createContract(user!, newContract)

      if (result) {
        setIsModalOpen(false)

        if (onContractCreated) {
          onContractCreated() // Refresh contracts in parent
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

  const handleTerminate = (): void => {
    setIsConfirmationOpen(true)
  }

  const handleConfirmTermination = async (): Promise<void> => {
    if (confirmationProjectId !== user!.projectId) {
      setError('Project ID does not match. Cannot terminate contract.')
      return
    }

    setIsLoading(true)

    try {
      if (!contract) {
        throw new Error('No contract to terminate')
      }

      const success = await deleteContract(contract.id)

      if (success) {
        setIsConfirmationOpen(false)

        if (onContractCreated) {
          onContractCreated() // Refresh contracts in parent
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

  const isPending = activeContract?.status === 'pending'

  const getStatusBadge = (status: string) => {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1)

    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-500">{formattedStatus}</Badge>
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-500">Pending Approval</Badge>
      default:
        return <Badge variant="outline">{formattedStatus}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2 border-b py-5 sm:flex-row">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Current Contract
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoadingContract ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : activeContract ? (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Zap className="h-4 w-" />
                Offload Amount
              </dt>
              <dd className="text-lg font-semibold pl-6">{activeContract.offloadAmount} kW</dd>
              <Separator className="mt-2" />
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Contract Period
              </dt>
              <dd className="text-sm pl-6">
                {formatDate(activeContract.startDate)} - {formatDate(activeContract.endDate)}
              </dd>
              <Separator className="mt-2" />
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <CheckCircle className="h-4 w-" />
                Status
              </dt>
              <dd className="text-sm pl-6 mt-1">{getStatusBadge(activeContract.status)}</dd>
              <Separator className="mt-2" />
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                Project ID
              </dt>
              <dd className="text-sm pl-6 text-muted-foreground">{activeContract.projectId}</dd>
            </div>

            {!isPending && (
              <div className="pt-4">
                <Button
                  variant="destructive"
                  onClick={handleTerminate}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" /> Terminate Contract
                </Button>
              </div>
            )}
          </dl>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="bg-muted/30 inline-flex rounded-full p-6">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <h3 className="font-medium text-lg">No Active Contract</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Engage in a contract to participate in demand response events
              </p>
              <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="h-4 w-4" /> Engage in a Contract
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Confirm Contract Termination
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">This action cannot be undone</p>
                <p className="text-sm text-amber-700 mt-1">
                  Terminating your contract will end your participation in future demand response
                  events.
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Enter Project ID to Confirm</Label>
              <p className="text-sm text-muted-foreground mb-2">{user!.projectId}</p>
              <Input
                type="text"
                value={confirmationProjectId}
                onChange={e => setConfirmationProjectId(e.target.value)}
                placeholder="Enter project ID to confirm"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmationOpen(false)}
              disabled={isLoading}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmTermination}
              disabled={isLoading || confirmationProjectId !== user!.projectId}
              className="sm:flex-1"
            >
              {isLoading ? 'Terminating...' : 'Confirm Termination'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Engage in a New Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <Label className="text-sm font-medium">Start Date</Label>
              <Input type="date" value={currentDateTime} disabled className="mt-1" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Offload Amount (kW)</Label>
                <span className="text-sm text-green-600">
                  {Math.round((offloadAmount / baselineOffload) * 100)}% of max
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                Max Offload Capability: {baselineOffload} kW
              </p>
              <Input
                type="range"
                min="0"
                max={baselineOffload}
                value={offloadAmount}
                onChange={e => setOffloadAmount(Number(e.target.value))}
                className="mt-1"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">0 kW</span>
                <span className="text-base font-medium">{offloadAmount} kW</span>
                <span className="text-xs text-muted-foreground">{baselineOffload} kW</span>
              </div>
              {offloadAmount > baselineOffload && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Offload amount exceeds max allowed
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white sm:flex-1"
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
