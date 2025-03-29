import { useState, useMemo } from 'react'

import { Calendar, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { DREvent } from '@/types'

export const CalendarCard = ({ events }: { events: DREvent[] }) => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Create a map of dates with events
  const eventDates = useMemo(() => {
    const dateMap = new Map<string, boolean>()

    events.forEach(event => {
      const startDate = new Date(event.start_time).toISOString().split('T')[0]
      dateMap.set(startDate, true)
    })

    return dateMap
  }, [events])

  return (
    <Card className="h-full flex flex-col justify-center items-center text-center p-6 rounded-xl">
      <CardHeader>
        <CardTitle>Demand Response Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
          modifiers={{
            highlighted: day => {
              const dateString = day.toISOString().split('T')[0]
              return eventDates.has(dateString)
            },
          }}
          modifiersStyles={{
            highlighted: {
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))',
              fontWeight: 'bold',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
