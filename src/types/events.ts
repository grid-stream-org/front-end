import { DREvent } from '@/types'

export interface SummaryCardsProps {
  events: DREvent[]
  isLoading: boolean
}

export interface EventCardProps {
  event: DREvent
}
