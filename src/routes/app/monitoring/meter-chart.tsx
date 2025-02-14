import { RealTimeChart } from './real-time-chart'

import { ChartConfig } from '@/components/ui'
import { DataPoint } from '@/types'

const chartConfig: ChartConfig = {
  baseline: { label: 'Building Baseline', color: 'hsl(var(--chart-1))' },
  load: { label: 'Building Load', color: 'hsl(var(--chart-2))' },
  consumption: { label: 'Actual Consumption', color: 'hsl(var(--chart-3))' },
}

export const MeterChart = ({
  data,
  isConnected,
  error,
}: {
  data: DataPoint[]
  isConnected: boolean
  error: Error | null
}) => {
  return (
    <RealTimeChart
      title="Metered Values"
      data={data}
      isConnected={isConnected}
      error={error}
      config={chartConfig}
      lines={[
        { dataKey: 'baseline', color: 'var(--color-baseline)', isDashed: true },
        { dataKey: 'load', color: 'var(--color-load)' },
        { dataKey: 'consumption', color: 'var(--color-consumption)' },
      ]}
    />
  )
}
