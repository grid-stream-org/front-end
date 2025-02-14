import { CloudAlert, CloudOff } from 'lucide-react'
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
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui'
import { useNow } from '@/hooks'
import { formatNumericDate } from '@/lib'
import { DataPoint, TIME_WINDOWS, TimeRangeOption } from '@/types'

interface SOCChartProps {
  data: DataPoint[]
  isConnected: boolean
  error: Error | null
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export const SOCChart = ({ data, isConnected, error }: SOCChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('10m')
  const now = useNow()

  const chartConfig = useMemo(() => {
    const deviceTypes = new Set<string>()

    data.forEach(point => {
      point.ders
        ?.filter(device => device.type !== 'solar')
        .forEach(device => {
          deviceTypes.add(device.type)
        })
    })

    return Array.from(deviceTypes).reduce((config, type, index) => {
      config[type] = {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
      return config
    }, {} as ChartConfig)
  }, [data])

  const processedData = useMemo(() => {
    const cutoff = now - TIME_WINDOWS[timeRange]
    return data
      .filter(pt => new Date(pt.date).getTime() > cutoff)
      .map(point => {
        const deviceSOCs = point.ders?.reduce(
          (acc, device) => {
            if (typeof device.current_soc === 'number') {
              acc[device.type] = device.current_soc
            }
            return acc
          },
          {} as Record<string, number>,
        )

        return {
          date: point.date,
          ...deviceSOCs,
        }
      })
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
      !processedData.length ||
      processedData.every(point =>
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
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={processedData}>
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
            domain={[0, 100]}
            tickFormatter={(val: number) => `${val}%`}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => formatNumericDate(payload[0].payload.date) || ''}
              />
            }
          />
          {Object.entries(chartConfig).map(([key, config]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={config.color}
              strokeWidth={2}
              connectNulls={false}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row mb-10">
        <CardTitle>State of Charge</CardTitle>
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
