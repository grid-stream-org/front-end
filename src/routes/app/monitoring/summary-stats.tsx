import {
  BatteryMedium,
  CloudOff,
  PlugZap,
  SatelliteDish,
  Activity,
  Scale,
  FileBarChart,
  TrendingUpDown,
  LucideIcon,
} from 'lucide-react'
import { ReactNode, useMemo, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNow } from '@/hooks'
import { TIME_WINDOWS, type DataPoint, type TimeRangeOption } from '@/types'

interface SummaryStatsProps {
  data: DataPoint[]
  isConnected: boolean
  error: Error | null
}

const SummaryStatsCard = ({
  children,
  timeRange,
  setTimeRange,
}: {
  children: ReactNode
  timeRange: TimeRangeOption
  // eslint-disable-next-line no-unused-vars
  setTimeRange: (value: TimeRangeOption) => void
}) => (
  <Card>
    <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
      <CardTitle>Real-time Summary</CardTitle>
      <Select
        value={timeRange}
        onValueChange={(value: string) => setTimeRange(value as TimeRangeOption)}
      >
        <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="5m" className="rounded-lg hover:cursor-pointer">
            Last 5 minutes
          </SelectItem>
          <SelectItem value="10m" className="rounded-lg hover:cursor-pointer">
            Last 10 minutes
          </SelectItem>
          <SelectItem value="30m" className="rounded-lg hover:cursor-pointer">
            Last 30 minutes
          </SelectItem>
          <SelectItem value="60m" className="rounded-lg hover:cursor-pointer">
            Last hour
          </SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">{children}</CardContent>
  </Card>
)

const NoDataState = () => (
  <div className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
    <CloudOff className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">No device data available</p>
  </div>
)

const SummaryStat = ({
  title,
  text,
  icon: Icon,
}: {
  title: string
  text: string
  icon: LucideIcon
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-9 w-9 text-muted-foreground" />
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xl sm:text-2xl font-bold">{text}</p>
    </div>
  </div>
)

export const SummaryStats = ({ data, isConnected }: SummaryStatsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('10m')
  const now = useNow()

  const visibleData = useMemo(() => {
    const cutoff = now - TIME_WINDOWS[timeRange]
    return data.filter(pt => new Date(pt.date).getTime() > cutoff)
  }, [data, timeRange, now])

  if (!isConnected) {
    return (
      <SummaryStatsCard timeRange={timeRange} setTimeRange={setTimeRange}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-9 w-9" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[70px]" />
              </div>
            </div>
          ))}
        </div>
      </SummaryStatsCard>
    )
  }

  const latest = visibleData[visibleData.length - 1]
  if (!latest || !latest.ders) {
    return (
      <SummaryStatsCard timeRange={timeRange} setTimeRange={setTimeRange}>
        <NoDataState />
      </SummaryStatsCard>
    )
  }

  // Calculate averages over the time window
  const avgLoad = visibleData.reduce((acc, pt) => acc + (pt.load || 0), 0) / visibleData.length
  const avgConsumption =
    visibleData.reduce((acc, pt) => acc + (pt.consumption || 0), 0) / visibleData.length
  const avgReduction =
    visibleData.reduce((acc, pt) => acc + (pt.reduction || 0), 0) / visibleData.length

  // Count online devices
  const onlineDevices = latest.ders.filter(d => d.is_online).length
  const totalDevices = latest.ders.length

  // Calculate average battery SOC
  const batteryDevices = latest.ders.filter(d => typeof d.current_soc === 'number')
  const avgSOC = batteryDevices.length
    ? batteryDevices.reduce((acc, d) => acc + d.current_soc, 0) / batteryDevices.length
    : 0

  return (
    <SummaryStatsCard timeRange={timeRange} setTimeRange={setTimeRange}>
      <div className="grid gap-8 grid-cols-2 lg:grid-cols-5">
        <SummaryStat title="Current Load" text={latest.load?.toFixed(1) + 'kW'} icon={Activity} />
        {/* <div className="flex items-center gap-2">
          <Activity className="h-9 w-9 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Current Load</p>
            <p className="text-2xl font-bold">{latest.load?.toFixed(1)} kW</p>
          </div>
        </div> */}
        <SummaryStat
          title="Current Consumption"
          text={latest.consumption?.toFixed(1) + 'kW'}
          icon={PlugZap}
        />
        <SummaryStat
          title="Current Reduction"
          text={latest.reduction?.toFixed(1) + 'kW'}
          icon={TrendingUpDown}
        />
        <SummaryStat title="Baseline" text={latest.baseline?.toFixed(1) + 'kW'} icon={Scale} />
        <SummaryStat
          title="Contract"
          text={latest.contract?.toFixed(1) + 'kW'}
          icon={FileBarChart}
        />
        <SummaryStat title="Average Load" text={avgLoad.toFixed(1) + 'kW'} icon={Activity} />
        <SummaryStat
          title="Average Consumption"
          text={avgConsumption.toFixed(1) + 'kW'}
          icon={PlugZap}
        />
        <SummaryStat
          title="Average Reduction"
          text={avgReduction.toFixed(1) + 'kW'}
          icon={TrendingUpDown}
        />
        <SummaryStat
          title="Device Status"
          text={onlineDevices + '/' + totalDevices}
          icon={SatelliteDish}
        />
        <SummaryStat title="Average SOC" text={avgSOC.toFixed(1) + '%'} icon={BatteryMedium} />
      </div>
    </SummaryStatsCard>
  )
}
