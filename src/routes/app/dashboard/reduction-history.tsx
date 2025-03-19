import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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

  useEffect(() => {
    if (!events || events.length === 0) return

    const sortedEvents = events
      .filter(event => event.start_time)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    const now = Date.now()
    const pastEvents = sortedEvents.filter(event => new Date(event.end_time).getTime() < now)

    if (pastEvents.length) {
      console.log('Last event found:', pastEvents[pastEvents.length - 1])
    } else {
      console.log('No past events found')
    }

    setLastEvent(pastEvents.length ? pastEvents[pastEvents.length - 1] : null)
  }, [events])

  useEffect(() => {
    const loadOffloadData = async () => {
      if (!lastEvent || !user) {
        if (!lastEvent) setError('No completed events found')
        return
      }

      if (!lastEvent.start_time || !lastEvent.end_time) {
        setError('Event is missing start or end time')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log('Loading data for event:', {
          start: lastEvent.start_time,
          end: lastEvent.end_time,
        })

        const offloadData = await fetchProjectAverages(
          user,
          lastEvent.start_time,
          lastEvent.end_time,
        )

        if (offloadData.length === 0) {
          console.log('No data returned from API')
          setError('No data available for the selected time period')
          setChartData([])
          return
        }

        console.log('Data received:', offloadData)

        const formattedData = offloadData.map(item => ({
          time: new Date(item.start_time).toLocaleTimeString(),
          baseline: item.baseline,
          average_output: item.average_output,
          threshold: item.contract_threshold,
        }))

        setChartData(formattedData)
      } catch (err) {
        console.error('Error loading offload data:', err)
        setError('Failed to load chart data')
      } finally {
        setIsLoading(false)
      }
    }

    loadOffloadData()
  }, [lastEvent, user])

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
      label: 'Threshold',
      color: 'hsl(var(--destructive))',
    },
  } satisfies ChartConfig

  const getEventTimeRange = () => {
    if (!lastEvent) return 'No completed events available'

    const startDate = new Date(lastEvent.start_time)
    const endDate = new Date(lastEvent.end_time)

    const formatDate = (date: Date) => {
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)} (Local Time)`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Previous Event Offload History</CardTitle>
          <CardDescription>{isLoading ? 'Loading...' : getEventTimeRange()}</CardDescription>
        </div>
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
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<ChartTooltip content={<ChartTooltipContent />} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke={chartConfig.baseline.color}
                  name={chartConfig.baseline.label}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="average_output"
                  stroke={chartConfig.average_output.color}
                  name={chartConfig.average_output.label}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke={chartConfig.threshold.color}
                  name={chartConfig.threshold.label}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
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
