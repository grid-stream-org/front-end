import { RealTimeChart } from './real-time-chart'

import { ChartConfig } from '@/components/ui'
import { DataPoint } from '@/types'

const chartConfig: ChartConfig = {
  contract: { label: 'Contract Threshold', color: 'hsl(var(--chart-3))' },
  reduction: { label: 'Energy Reduction', color: 'hsl(var(--chart-2))' },
}

export const ReducationChart = ({
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
      title="Energy Reduction"
      data={data}
      isConnected={isConnected}
      error={error}
      config={chartConfig}
      lines={[
        { dataKey: 'contract', color: 'var(--color-contract)', isDashed: true },
        { dataKey: 'reduction', color: 'var(--color-reduction)' },
      ]}
    />
  )
}
