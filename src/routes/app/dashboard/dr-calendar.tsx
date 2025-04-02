import { Calendar as CalendarIcon } from 'lucide-react'
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
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between gap-2 border-b py-5 sm:flex-row">
        <CardTitle>Demand Response Calendar</CardTitle>
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex justify-center w-full flex-col py-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full max-w-full pb-5"
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

          <div className="flex items-center justify-center pb-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary/20"></div>
              <span className="text-xs text-muted-foreground">DR Events</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
