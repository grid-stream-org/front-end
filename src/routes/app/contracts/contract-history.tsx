import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context'
import { deleteContract } from '@/hooks/use-contracts'

const ContractHistory = ({ contracts, isLoading, error, onContractDeleted }) => {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [projectIdInput, setProjectIdInput] = useState('')

  const handleDelete = async () => {
    if (!selectedContract || projectIdInput !== selectedContract.projectId) return

    try {
      const success = await deleteContract(user, selectedContract.id)
      if (success && onContractDeleted) {
        onContractDeleted()
      }
      setIsDialogOpen(false)
    } catch (err) {
      console.error('Failed to delete contract:', err)
    }
  }

  const openDeleteDialog = contract => {
    setSelectedContract(contract)
    setProjectIdInput('')
    setIsDialogOpen(true)
  }

  //Format contracts for display in chart
  const processedContracts = contracts.map(contract => ({
    id: contract.id,
    year: new Date(contract.start_date).getFullYear(),
    projectId: contract.project_id,
    offloadAmount: contract.contract_threshold,
    startDate: contract.start_date,
    endDate: contract.end_date,
    status: contract.status,
  }))

  const filteredContracts = processedContracts.filter(
    contract => contract.status === 'active' || contract.status === 'inactive',
  )

  const yearlyOffload = filteredContracts.reduce((acc, contract) => {
    acc[contract.year] = (acc[contract.year] || 0) + contract.offloadAmount
    return acc
  }, {})

  const barData = Object.keys(yearlyOffload).map(year => ({
    year,
    offload: yearlyOffload[year],
  }))

  if (isLoading) return <div>Loading contracts...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Offload (kW)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedContracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No contracts found
                </TableCell>
              </TableRow>
            ) : (
              processedContracts.map(contract => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.year}</TableCell>
                  <TableCell>{contract.projectId}</TableCell>
                  <TableCell>{contract.offloadAmount} kW</TableCell>
                  <TableCell>{contract.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(contract)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {barData.length > 0 && (
        <CardContent>
          <CardTitle className="mb-4">Offload History</CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Bar dataKey="offload" fill="#1E40AF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Contract Termination
              <br />
              <span className="text-sm text-muted-foreground">
                Project ID: {selectedContract?.projectId}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Enter Project ID to Confirm Termination</Label>
              <Input
                type="text"
                value={projectIdInput}
                onChange={e => setProjectIdInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={projectIdInput !== selectedContract?.projectId}
            >
              {isLoading ? 'Terminating...' : 'Confirm Termination'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ContractHistory
