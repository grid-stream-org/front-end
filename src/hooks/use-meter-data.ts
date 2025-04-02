import { useEffect } from 'react'

import { useMqttData } from '@/context/mqtt'
import { useMeterStore } from '@/state'
import { DERData } from '@/types'

export const useMeterData = () => {
  const { data } = useMqttData()
  const { addDataPoint, cleanOldData } = useMeterStore()

  // Process MQTT data immediately when it arrives
  useEffect(() => {
    if (!data?.length) return

    const totalOutput = data.reduce((sum: number, der: DERData) => sum + der.current_output, 0)
    const baseline = data[0].baseline
    const consumption = data[0].power_meter_measurement - totalOutput

    addDataPoint({
      date: new Date(data[0].timestamp).getTime(),
      baseline,
      load: data[0].power_meter_measurement,
      consumption,
      contract: data[0].contract_threshold,
      reduction: baseline - consumption,
      ders: data,
    })
  }, [data, addDataPoint])

  useEffect(() => {
    cleanOldData()

    // Then set interval
    const cleanup = setInterval(cleanOldData, 5 * 60 * 1000)

    return () => clearInterval(cleanup)
  }, [cleanOldData])
}
