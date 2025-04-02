import { FileCheck, Zap, Calendar, CalendarRange, ActivitySquare } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1)

    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-500">{formattedStatus}</Badge>
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-500">{formattedStatus}</Badge>
      default:
        return <Badge variant="outline">{formattedStatus}</Badge>
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between gap-2 border-b py-5 sm:flex-row mb-4">
        <CardTitle>Current Contract</CardTitle>
        <FileCheck className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : contract ? (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Offload Amount
              </dt>
              <dd className="text-sm font-semibold pl-6">{contract.contract_threshold} kW</dd>
              <Separator className="mt-2" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </dt>
              <dd className="text-sm pl-6">{formatDate(contract.start_date)}</dd>
              <Separator className="mt-2" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                End Date
              </dt>
              <dd className="text-sm pl-6">{formatDate(contract.end_date)}</dd>
              <Separator className="mt-2" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <ActivitySquare className="h-4 w-4 " />
                Status
              </dt>
              <dd className="text-sm pl-6 mt-1">{getStatusBadge(contract.status)}</dd>
            </div>
          </dl>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <FileCheck className="h-10 w-10 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No active contract at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
