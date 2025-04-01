import { FileBarChart } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context'
import { fetchProjectAverages } from '@/hooks/use-project-averages'
import { DREvent, ProjectAverage } from '@/types'

export const OffloadHistoryChart = ({ events }: { events: DREvent[] }) => {
  const { user } = useAuth()
  const [chartData, setChartData] = useState<ProjectAverage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastEvent, setLastEvent] = useState<DREvent | null>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    if (isLoadingRef.current) return

    const loadData = async () => {
      if (isLoadingRef.current) return
      isLoadingRef.current = true

      setIsLoading(true)
      setError(null)

      try {
        if (!events?.length || !user) {
          setError(!events?.length ? 'No events found' : 'User not authenticated')
          return
        }

        const validEvents = events.filter(event => event?.start_time && event?.end_time)
        if (!validEvents.length) {
          setError('No valid events found')
          return
        }

        // Sort events
        const sortedEvents = [...validEvents].sort((a, b) => {
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        })

        const now = Date.now()
        const pastEvents = sortedEvents.filter(event => {
          return new Date(event.end_time).getTime() < now
        })

        if (!pastEvents.length) {
          setError('No completed events found')
          return
        }

        const latestEvent = pastEvents[pastEvents.length - 1]
        const offloadData = await fetchProjectAverages(
          user,
          latestEvent.start_time,
          latestEvent.end_time,
        )

        if (!offloadData?.length) {
          setError('No data available for the selected time period')
          return
        }

        // Format data for the chart
        const formattedData = offloadData
          .filter(item => item?.start_time)
          .map(item => {
            const baseline = typeof item.baseline === 'number' ? item.baseline : 0
            const threshold =
              typeof item.contract_threshold === 'number' ? item.contract_threshold : 0

            return {
              time: new Date(item.start_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              baseline: baseline,
              average_output: typeof item.average_output === 'number' ? item.average_output : 0,
              threshold: baseline - threshold,
            }
          })

        setChartData(formattedData)
        setLastEvent(latestEvent)
      } catch (err: unknown) {
        console.error('Error loading offload data:', err)
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    }

    loadData()
  }, [events, user])

  // Chart configuration
  const chartConfig = {
    baseline: {
      label: 'Baseline',
      color: 'hsl(var(--chart-1))',
    },
    average_output: {
      label: 'Average Output',
      color: 'hsl(var(--chart-2))',
    },
    threshold: {
      label: 'Baseline - Threshold',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  const getEventTimeRange = () => {
    if (!lastEvent?.start_time || !lastEvent?.end_time) {
      return 'No completed events available'
    }

    try {
      const startDate = new Date(lastEvent.start_time)
      const endDate = new Date(lastEvent.end_time)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Invalid event dates'
      }

      const formatDate = (date: Date) => {
        return (
          date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }) +
          ', ' +
          date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        )
      }

      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    } catch (err) {
      console.error('Error loading offload data:', err)
      return 'Error processing event dates'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between gap-2 border-b py-5 sm:flex-row">
        <div className="flex flex-col gap-1">
          <CardTitle>Previous Event Offload History</CardTitle>
          <CardDescription>{isLoading ? 'Loading...' : getEventTimeRange()}</CardDescription>
        </div>
        <FileBarChart className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-[300px] w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-center text-muted-foreground">
            {error}
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 24,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={32} />
                <YAxis
                  tickFormatter={(val: number) => `${val.toFixed(0)} kW`}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  name="Baseline"
                  dataKey="baseline"
                  type="monotone"
                  stroke="var(--color-baseline)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  name="Average Output"
                  dataKey="average_output"
                  type="monotone"
                  stroke="var(--color-average_output)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  name="Baseline-Threshold"
                  dataKey="threshold"
                  type="monotone"
                  stroke="var(--color-threshold)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <span className="text-muted-foreground">
              No data available for the selected time period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
