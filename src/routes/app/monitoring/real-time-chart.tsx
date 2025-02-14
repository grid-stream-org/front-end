import { CloudOff, CloudAlert } from 'lucide-react'
import { useState, useMemo } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui'
import { useNow } from '@/hooks'
import { formatNumericDate } from '@/lib'
import { DataPoint, TIME_WINDOWS, TimeRangeOption } from '@/types'

const BUFFER_TIME = 1 * 60 * 1000

interface RealTimeChartProps {
  title: string
  data: DataPoint[]
  isConnected: boolean
  error: Error | null
  config: ChartConfig
  lines: Array<{
    dataKey: string
    color: string
    isDashed?: boolean
  }>
}

export const RealTimeChart = ({
  title,
  data,
  isConnected,
  error,
  config,
  lines,
}: RealTimeChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('10m')
  const now = useNow()

  const visibleData = useMemo(() => {
    const windowTime = TIME_WINDOWS[timeRange]
    const cutoff = now - (windowTime + BUFFER_TIME)
    return data.filter(pt => new Date(pt.date).getTime() > cutoff)
  }, [data, timeRange, now])

  const ticks = useMemo(() => {
    const windowTime = TIME_WINDOWS[timeRange]
    const tickInterval = 60000
    const start = now - windowTime
    const firstTick = Math.ceil(start / tickInterval) * tickInterval
    const ticksArr: number[] = []
    for (let t = firstTick; t <= now; t += tickInterval) {
      ticksArr.push(t)
    }
    return ticksArr
  }, [now, timeRange])

  const cardContent = () => {
    if (!isConnected) {
      return (
        <>
          <Skeleton className="h-[280px] w-full rounded-lg" />
          <div className="flex justify-center space-x-4 mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border border-dashed rounded-lg border-destructive">
          <CloudAlert size={36} className="text-destructive" />
          <p className="text-sm text-destructive">
            Error: {error ? error.message : 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      )
    }

    if (
      visibleData.length === 0 ||
      visibleData.every(point =>
        Object.entries(point).every(([key, value]) => key === 'date' || value === null),
      )
    ) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border border-dashed rounded-lg">
          <CloudOff size={36} />
          <p className="text-sm">No data available for the selected time range</p>
        </div>
      )
    }

    return (
      <ChartContainer config={config} className="h-[300px] w-full">
        <LineChart data={visibleData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            type="number"
            domain={[now - TIME_WINDOWS[timeRange], now]}
            ticks={ticks}
            tickFormatter={formatNumericDate}
            tickLine={false}
            axisLine={false}
            minTickGap={32}
          />
          <YAxis
            tickFormatter={(val: number) => `${val.toFixed(0)} kW`}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => formatNumericDate(payload[0].payload.date) || ''}
                indicator="dot"
              />
            }
          />
          {lines.map(({ dataKey, color, isDashed }) => (
            <Line
              key={dataKey}
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              connectNulls={false}
              strokeDasharray={isDashed ? '5 5' : undefined}
              dot={false}
              type="monotone"
              isAnimationActive={false}
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
        <CardTitle>{title}</CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value: string) => setTimeRange(value as TimeRangeOption)}
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1m" className="rounded-lg hover:cursor-pointer">
              Last 1 minute
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">{cardContent()}</CardContent>
    </Card>
  )
}
