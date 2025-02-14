import { formatDistanceToNow } from 'date-fns'
import {
  BatteryMedium,
  Cable,
  Clock,
  CloudOff,
  PersonStanding,
  LucideIcon,
  CloudAlert,
} from 'lucide-react'
import { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
} from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import type { DataPoint } from '@/types'

interface DeviceStatusGridProps {
  data: DataPoint[] | null
  isConnected: boolean
  error: Error | null
}

const DeviceSkeleton = () => (
  <div className="grid auto-cols-max grid-flow-col gap-4 overflow-auto min-h-[200px]">
    {[1, 2, 3].map(index => (
      <div key={index} className="flex flex-col space-y-3 rounded-lg border p-4 min-w-[300px]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const NoDataState = () => (
  <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
    <CloudOff className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">No device data available</p>
  </div>
)

const StatusRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string | number
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm">{value}</span>
  </div>
)

const DeviceStatusCard = ({ children }: { children: ReactNode }) => (
  <Card>
    <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
      <CardTitle>Device Status</CardTitle>
    </CardHeader>
    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">{children}</CardContent>
  </Card>
)

export const DeviceStatusGrid = ({ data, isConnected, error }: DeviceStatusGridProps) => {
  if (!isConnected) {
    return (
      <DeviceStatusCard>
        <DeviceSkeleton />
      </DeviceStatusCard>
    )
  }

  if (error) {
    return (
      <DeviceStatusCard>
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border border-dashed rounded-lg border-destructive">
          <CloudAlert size={36} className="text-destructive" />
          <p className="text-sm text-destructive">
            Error: {error ? error.message : 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      </DeviceStatusCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <DeviceStatusCard>
        <NoDataState />
      </DeviceStatusCard>
    )
  }

  const ders = data[data.length - 1].ders

  if (!ders) {
    return (
      <DeviceStatusCard>
        <NoDataState />
      </DeviceStatusCard>
    )
  }

  const dersByType = ders.reduce(
    (acc, der) => {
      if (!acc[der.type]) acc[der.type] = []
      acc[der.type].push(der)
      return acc
    },
    {} as Record<string, typeof ders>,
  )

  return (
    <DeviceStatusCard>
      <Tabs defaultValue={Object.keys(dersByType)[0]} className="space-y-4">
        <TabsList>
          {Object.keys(dersByType).map(type => (
            <TabsTrigger key={type} value={type} className="capitalize">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(dersByType).map(([type, typeDers]) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid auto-cols-max grid-flow-col gap-4 overflow-auto">
              {typeDers.map(der => (
                <div
                  key={der.der_id}
                  className="flex flex-col space-y-3 rounded-lg border p-4 min-w-[300px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ID: {der.der_id}</span>
                    <Badge
                      className={`text-background py-1 ${
                        der.is_online
                          ? 'bg-green-600 hover:bg-green-500'
                          : 'bg-red-600 hover:bg-red-500'
                      }`}
                    >
                      {der.is_online ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <StatusRow
                      icon={Cable}
                      label="Output"
                      value={`${der.current_output.toFixed(2)} ${der.units}`}
                    />
                    <StatusRow
                      icon={Clock}
                      label="Connected"
                      value={formatDistanceToNow(new Date(der.connection_start_at), {
                        addSuffix: true,
                      })}
                    />
                    {typeof der.current_soc === 'number' && (
                      <StatusRow
                        icon={BatteryMedium}
                        label="SOC"
                        value={der.type === 'battery' ? `${der.current_soc.toFixed(1)}%` : 'N/A'}
                      />
                    )}
                    <StatusRow
                      icon={PersonStanding}
                      label="Standalone"
                      value={der.is_standalone ? 'Yes' : 'No'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </DeviceStatusCard>
  )
}
