import { LineChart, Line, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui'
import { formatNumericDate } from '@/lib'

const chartConfig = {
  reduction: { label: 'Reduction', color: 'hsl(var(--chart-1))' },
  baseline: { label: 'Baseline', color: 'hsl(var(--chart-2))' },
  measurement: { label: 'Measurement', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

const data = [
  {
    date: new Date('2025-02-24T19:00:00').getTime(),
    reduction: 10,
    baseline: 102,
    measurement: 78,
  },
  {
    date: new Date('2025-02-24T19:05:00').getTime(),
    reduction: 15,
    baseline: 108,
    measurement: 83,
  },
  {
    date: new Date('2025-02-24T19:15:00').getTime(),
    reduction: 20,
    baseline: 112,
    measurement: 92,
  },
  {
    date: new Date('2025-02-24T19:20:00').getTime(),
    reduction: 18,
    baseline: 118,
    measurement: 97,
  },
  {
    date: new Date('2025-02-24T19:25:00').getTime(),
    reduction: 22,
    baseline: 122,
    measurement: 101,
  },
  {
    date: new Date('2025-02-24T19:30:00').getTime(),
    reduction: 25,
    baseline: 119,
    measurement: 96,
  },
  {
    date: new Date('2025-02-24T19:35:00').getTime(),
    reduction: 28,
    baseline: 113,
    measurement: 94,
  },
  {
    date: new Date('2025-02-24T19:40:00').getTime(),
    reduction: 30,
    baseline: 117,
    measurement: 99,
  },
  {
    date: new Date('2025-02-24T19:45:00').getTime(),
    reduction: 26,
    baseline: 110,
    measurement: 89,
  },
  {
    date: new Date('2025-02-24T19:50:00').getTime(),
    reduction: 24,
    baseline: 108,
    measurement: 85,
  },
  {
    date: new Date('2025-02-24T19:55:00').getTime(),
    reduction: 20,
    baseline: 105,
    measurement: 87,
  },
  {
    date: new Date('2025-02-24T20:00:00').getTime(),
    reduction: 18,
    baseline: 107,
    measurement: 90,
  },
]

const StaticChart = () => {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={formatNumericDate} />
        <YAxis />
        <ChartTooltip
          cursor
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => formatNumericDate(payload[0].payload.date) || ''}
              indicator="dot"
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="reduction"
          stroke="var(--color-reduction)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="baseline"
          stroke="var(--color-baseline)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="measurement"
          stroke="var(--color-measurement)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default StaticChart
