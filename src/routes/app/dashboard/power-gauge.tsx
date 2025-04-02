import { Gauge } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DataPoint } from '@/types'

interface PowerConsumptionGaugeProps {
  data: DataPoint[]
  isConnected?: boolean
  error?: Error | null
}

export const PowerConsumptionGauge = ({
  data,
  isConnected = true,
  error = null,
}: PowerConsumptionGaugeProps) => {
  const [baseline, setBaseline] = useState(0)
  const [reduction, setRedction] = useState(0)
  const [threshold, setThreshold] = useState(0)
  const [status, setStatus] = useState('No Data')
  const [statusColor, setStatusColor] = useState('text-gray-500')
  const [percentage, setPercentage] = useState(0)

  // Format to 2 decimal places
  const formatValue = (value: number) => Number(value.toFixed(2))

  useEffect(() => {
    if (data && data.length > 0) {
      const latestData = data[data.length - 1]

      setBaseline(formatValue(latestData.baseline!))
      setThreshold(formatValue(latestData.contract!))
      setRedction(formatValue(latestData.reduction!))

      if (latestData.reduction! > latestData.contract!) {
        setStatus('Meeting Target')
        setStatusColor('text-green-500')
      } else if (latestData.reduction! > latestData.contract! * 0.8) {
        setStatus('Near Threshold')
        setStatusColor('text-amber-500')
      } else {
        setStatus('Risk of Violation')
        setStatusColor('text-red-500')
      }

      if (latestData.reduction !== undefined && latestData.contract !== undefined) {
        const calculatedPercentage = (latestData.reduction! / latestData.contract!) * 100
        setPercentage(formatValue(Math.max(-100, Math.min(200, calculatedPercentage))))
      }
    }
  }, [data])

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between gap-2 border-b py-5 sm:flex-row">
        <div className="flex flex-col gap-1">
          <CardTitle>Real-Time Power Consumption</CardTitle>
          <CardDescription>Current demand response performance</CardDescription>
        </div>
        <Gauge className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6">
        {!isConnected ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Not connected to real-time data source. Reconnecting...
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center text-muted-foreground">
            Waiting for data...
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-2xl font-bold">{reduction} kW</div>
              <Badge variant="outline" className={statusColor}>
                {status}
              </Badge>
            </div>

            <Progress
              value={percentage > 100 ? 100 : percentage}
              className="h-3 mb-2 bg-secondary/20"
            >
              <div
                className="h-full bg-secondary rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </Progress>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Baseline</span>
                <span className="text-lg font-semibold">{baseline} kW</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Threshold</span>
                <span className="text-lg font-semibold">{threshold} kW</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Reduction</span>
                <span className={`text-lg font-semibold ${statusColor}`}>
                  {percentage > 0 ? `${percentage}%` : '0%'}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
