import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context'
import { fetchContracts, deleteContract } from '@/hooks/use-contracts'

const ContractHistory = () => {
  const { user } = useAuth()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadContracts = async () => {
      setLoading(true)
      try {
        const contractsData = await fetchContracts(user)
        setContracts(contractsData)
      } catch (err) {
        setError('Failed to load contracts')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadContracts()
    }
  }, [user])

  const handleDelete = async contractId => {
    try {
      const success = await deleteContract(user, contractId)
      if (success) {
        setContracts(contracts.filter(contract => contract.id !== contractId))
      }
    } catch (err) {
      setError('Failed to delete contract')
      console.log(err)
    }
  }

  // Process contract data for display
  const processedContracts = contracts.map(contract => ({
    id: contract.id,
    year: new Date(contract.start_date).getFullYear(),
    projectId: contract.project_id,
    offloadAmount: contract.contract_threshold,
    startDate: contract.start_date,
    endDate: contract.end_date,
    status: contract.status,
  }))

  // Aggregate total offload per year
  const yearlyOffload = processedContracts.reduce((acc, contract) => {
    acc[contract.year] = (acc[contract.year] || 0) + contract.offloadAmount
    return acc
  }, {})

  // Format data for the chart
  const barData = Object.keys(yearlyOffload).map(year => ({
    year,
    offload: yearlyOffload[year],
  }))

  if (loading) return <div>Loading contracts...</div>
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
                      onClick={() => handleDelete(contract.id)}
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

      {/* Bar Chart: Offload Amount Over the Years */}
      {barData.length > 0 && (
        <CardContent>
          <CardTitle className="mb-4">Offload History</CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="offload" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      )}
    </Card>
  )
}

export default ContractHistory
