import { CloudAlert, CloudOff } from 'lucide-react'
import { useState, useMemo } from 'react'
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts'

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

interface DeviceContributionChartProps {
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

export const DeviceContributionChart = ({
  data,
  isConnected,
  error,
}: DeviceContributionChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('10m')
  const now = useNow()

  const chartConfig = useMemo(() => {
    const deviceTypes = new Set<string>()

    data.forEach(point => {
      point.ders?.forEach(device => {
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

  const currentPercentages = useMemo(() => {
    // Get the most recent data point
    const latestPoint = data[data.length - 1]

    if (!latestPoint || !latestPoint.ders) {
      return
    }

    // Calculate total output
    const total = latestPoint.ders.reduce((sum, device) => sum + device.current_output, 0) ?? 0

    // Calculate percentages for each device type
    return latestPoint.ders.reduce(
      (acc, device) => {
        acc[device.type] = (device.current_output / total) * 100
        return acc
      },
      {} as Record<string, number>,
    )
  }, [data])

  const visibleData = useMemo(() => {
    const windowTime = TIME_WINDOWS[timeRange]
    const cutoff = now - (windowTime + BUFFER_TIME)
    return data
      .filter(pt => new Date(pt.date).getTime() > cutoff)
      .map(point => {
        if (!point.ders) {
          return
        }

        const contributions = point.ders.reduce(
          (acc, device) => {
            if (!acc[device.type]) {
              acc[device.type] = 0
            }
            acc[device.type] += device.current_output
            return acc
          },
          {} as Record<string, number>,
        )

        return {
          date: point.date,
          ...contributions,
        }
      })
      .filter(Boolean)
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

    if (!visibleData.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border border-dashed rounded-lg">
          <CloudOff size={36} />
          <p className="text-sm">No data available for the selected time range</p>
        </div>
      )
    }

    return (
      <>
        {currentPercentages && (
          <div className="flex flex-wrap gap-4 mb-5 text-sm">
            {Object.entries(chartConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: config.color }} />
                <span>{config.label}: </span>
                <span className="font-semibold">{currentPercentages[key]?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={visibleData}>
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
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => formatNumericDate(payload[0].payload.date) || ''}
                />
              }
            />
            {Object.entries(chartConfig).map(([key, config]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={config.color}
                fill={config.color}
                stackId="1"
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
        <CardTitle>Device Contributions (KW)</CardTitle>
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
