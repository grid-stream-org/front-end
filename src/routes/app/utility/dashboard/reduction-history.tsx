import { useEffect, useState, useRef } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
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
      label: 'Baseline-Threshold',
      color: 'hsl(var(--destructive))',
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
          date.toLocaleDateString() +
          ' ' +
          date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        )
      }

      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    } catch (err) {
      console.error('Error loading offload data:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Event Offload History</CardTitle>
        <CardDescription>{isLoading ? 'Loading...' : getEventTimeRange()}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <span>Loading chart data...</span>
          </div>
        ) : error ? (
          <div className="flex h-[350px] items-center justify-center text-center text-muted-foreground">
            {error}
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              height={350}
              margin={{
                left: 24,
                right: 24,
                top: 24,
                bottom: 24,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="time" tickLine={true} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="baseline"
                type="monotone"
                stroke="var(--color-baseline)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="average_output"
                type="monotone"
                stroke="var(--color-average_output)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="threshold"
                type="monotone"
                stroke="var(--color-threshold)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[350px] items-center justify-center">
            No data available for the selected time period
          </div>
        )}
      </CardContent>
    </Card>
  )
}
