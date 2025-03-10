'use client'

import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label as FormLabel } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteContract } from '@/hooks/use-contracts'

// Define contract interfaces
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
  year: number
  projectId: string
  offloadAmount: number
  startDate: string
  endDate: string
  status: string
}

// Tooltip props interface
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    name?: string
  }>
  label?: string
}

interface ContractHistoryProps {
  contracts: ContractData[]
  isLoading: boolean
  error: string | null
  onContractDeleted?: () => void
}

const ContractHistory = ({
  contracts,
  isLoading,
  error,
  onContractDeleted,
}: ContractHistoryProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedContract, setSelectedContract] = useState<ProcessedContract | null>(null)
  const [projectIdInput, setProjectIdInput] = useState<string>('')

  const handleDelete = async (): Promise<void> => {
    if (!selectedContract || projectIdInput !== selectedContract.projectId) return

    try {
      const success = await deleteContract(selectedContract.id)
      if (success && onContractDeleted) {
        onContractDeleted()
      }
      setIsDialogOpen(false)
    } catch (err) {
      console.error('Failed to delete contract:', err)
    }
  }

  const openDeleteDialog = (contract: ProcessedContract): void => {
    setSelectedContract(contract)
    setProjectIdInput('')
    setIsDialogOpen(true)
  }

  // Format contracts for display in chart
  const processedContracts: ProcessedContract[] = contracts.map(contract => ({
    id: contract.id,
    year: new Date(contract.start_date).getFullYear(),
    projectId: contract.project_id,
    offloadAmount: contract.contract_threshold,
    startDate: contract.start_date,
    endDate: contract.end_date,
    status: contract.status,
  }))

  const filteredContracts: ProcessedContract[] = processedContracts.filter(
    contract => contract.status === 'active' || contract.status === 'inactive',
  )

  const yearlyOffload: Record<string, number> = filteredContracts.reduce(
    (acc, contract) => {
      acc[contract.year] = (acc[contract.year] || 0) + contract.offloadAmount
      return acc
    },
    {} as Record<string, number>,
  )

  // Format data for shadcn/ui Chart
  const chartData = Object.keys(yearlyOffload).map(year => ({
    year,
    offload: yearlyOffload[year],
  }))

  // Chart configuration
  const chartConfig = {
    offload: {
      label: 'Offload (kW)',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`Year: ${label}`}</p>
          <p className="text-chart-1">{`Offload: ${payload[0].value} kW`}</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) return <div>Loading contracts...</div>
  if (error) return <div>Error: {error}</div>

  // Calculate percentage change if there are at least two years of data
  const years = Object.keys(yearlyOffload).sort()
  let trendPercentage = 0
  let trendingUp = false

  if (years.length >= 2) {
    const currentYear = years[years.length - 1]
    const previousYear = years[years.length - 2]
    const currentValue = yearlyOffload[currentYear]
    const previousValue = yearlyOffload[previousYear]

    if (previousValue > 0) {
      trendPercentage = ((currentValue - previousValue) / previousValue) * 100
      trendingUp = trendPercentage > 0
    }
  }

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

      {chartData.length > 0 && (
        <>
          <CardHeader>
            <CardTitle>Offload History</CardTitle>
            <CardDescription>Year-by-Year Comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false}>
                  <Label
                    value="Year"
                    position="bottom"
                    offset={20}
                    style={{
                      textAnchor: 'middle',
                      fontSize: '12px',
                      fill: 'var(--muted-foreground)',
                    }}
                  />
                </XAxis>
                <ChartTooltip cursor content={<ChartTooltipContent indicator="dot" />} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10}>
                  <Label
                    value="Offload (kW)"
                    angle={-90}
                    position="left"
                    offset={-10}
                    style={{
                      textAnchor: 'middle',
                      fontSize: '12px',
                      fill: 'var(--muted-foreground)',
                    }}
                  />
                </YAxis>
                <ChartTooltip cursor={false} content={<CustomTooltip />} />
                <Bar
                  dataKey="offload"
                  fill="var(--color-offload)"
                  radius={8}
                  name="Offload (kW)"
                  // Add labels on top of each bar
                  label={{
                    position: 'top',
                    formatter: (value: number) => `${value} kW`,
                    fontSize: 12,
                    fill: 'var(--muted-foreground)',
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          {years.length >= 2 && (
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                {trendingUp ? 'Trending up' : 'Trending down'} by{' '}
                {Math.abs(trendPercentage).toFixed(1)}% from previous year
                <TrendingUp className={`h-4 w-4 ${!trendingUp ? 'transform rotate-180' : ''}`} />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total offload amounts by year
              </div>
            </CardFooter>
          )}
        </>
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
              <FormLabel>Enter Project ID to Confirm Termination</FormLabel>
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
