import { useState, useEffect } from 'react'

import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context'
import { fetchEvents } from '@/hooks/fetch-events'
import { DREvent } from '@/types'

const CalendarCard = () => {
  const [eventDates, setEventDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (!user) return
        const data = await fetchEvents(user)

        // Extract event start dates and convert them to Date objects
        const eventDateObjects = data.map((event: DREvent) => new Date(event.start_time))

        setEventDates(eventDateObjects)
      } catch (error) {
        console.error('Failed to load events:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadEvents()
    }
  }, [user])

  return (
    <Card className="h-full flex flex-col justify-center items-center text-center p-6">
      <CardHeader>
        <CardTitle>Demand Response Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            <p className="text-muted-foreground mb-2">
              Highlighted dates indicate scheduled Demand Response events.
            </p>
            <Calendar
              mode="single"
              modifiers={{ event: eventDates }}
              modifiersClassNames={{ event: 'bg-primary text-white rounded-md' }}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CalendarCard
