export interface DERData {
  project_id: string
  der_id: string
  is_online: boolean
  current_output: number
  is_standalone: boolean
  baseline: number
  connection_start_at: string
  current_soc: number
  contract_threshold: number
  power_meter_measurement: number
  units: string
  timestamp: string
  type: string
  nameplate_capacity: number
}

export interface DataPoint {
  date: number
  baseline: number | null
  load: number | null
  consumption: number | null
  contract: number | null
  reduction: number | null
  ders: DERData[] | null
}

export type TimeRangeOption = '5m' | '10m' | '30m' | '60m'

export const TIME_WINDOWS = {
  '5m': 5 * 60 * 1000,
  '10m': 10 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '60m': 60 * 60 * 1000,
} as const

export type TimeRangeKey = keyof typeof TIME_WINDOWS

export type MeterState = {
  data: DataPoint[]
  // eslint-disable-next-line no-unused-vars
  addDataPoint: (point: DataPoint) => void
  cleanOldData: () => void
}
