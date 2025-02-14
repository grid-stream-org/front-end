import { useEffect, useRef } from 'react'

import { useMqttData } from '@/context'
import { useMeterStore } from '@/state'
import { DERData } from '@/types'

const INTERVAL = 10000

export const useMeterData = () => {
  const { data } = useMqttData()
  const { addDataPoint, cleanOldData } = useMeterStore()
  const lastDataRef = useRef<DERData[] | null>(null)

  useEffect(() => {
    if (!data?.length) return
    lastDataRef.current = data
  }, [data])

  useEffect(() => {
    const addPoint = () => {
      const currentData = lastDataRef.current

      if (currentData?.length) {
        const totalOutput = currentData.reduce(
          (sum: number, der: DERData) => sum + der.current_output,
          0,
        )
        const baseline = currentData[0].baseline
        const consumption = currentData[0].power_meter_measurement - totalOutput
        addDataPoint({
          date: new Date(currentData[0].timestamp).getTime(),
          baseline,
          // TODO we need to figure out this math
          load: currentData[0].power_meter_measurement,
          consumption,
          contract: currentData[0].contract_threshold,
          reduction: baseline - consumption,
          ders: currentData,
        })
      } else {
        addDataPoint({
          date: Date.now(),
          baseline: null,
          load: null,
          consumption: null,
          contract: null,
          reduction: null,
          ders: null,
        })
      }

      // Clear the last data so we don't reuse it
      lastDataRef.current = null
    }

    const intervalId = setInterval(addPoint, INTERVAL)
    return () => clearInterval(intervalId)
  }, [addDataPoint])

  // Clean up old data every 5 minutes
  useEffect(() => {
    const cleanup = setInterval(cleanOldData, 5 * 60 * 1000)
    return () => clearInterval(cleanup)
  }, [cleanOldData])
}
