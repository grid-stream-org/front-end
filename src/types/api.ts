export type Project = {
  id: string
  utility_id: string
  user_id: string
  location: string
}

export type DER = {
  id: string
  project_id: string
  type: string
  nameplate_capacity: number
  power_capacity: number
}

export type DREvent = {
  id: string
  start_time: string
  end_time: string
  utility_id: number
}

export type Contract = {
  id: string
  contract_threshold: number
  start_date: string
  end_date: string
  status: string
  project_id: string
}

export type ProjectAverage = {
  time: string
  baseline: number
  average_output: number
  threshold: number
}
