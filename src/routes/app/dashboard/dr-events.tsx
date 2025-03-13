import { useState, useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context'
import { fetchEvents } from '@/hooks/fetch-events'
import { DREvent } from '@/types'

const DemandResponseEvent = () => {
  const [nextEvent, setNextEvent] = useState<DREvent | null>(null)
  const [lastEvent, setLastEvent] = useState<DREvent | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return
      try {
        const data = await fetchEvents(user)

        // Sort events by start time
        const sortedEvents = data
          .filter(event => event.start_time) // Ensure valid start times
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

        const now = Date.now()
        const pastEvents = sortedEvents.filter(event => new Date(event.end_time).getTime() < now)
        const futureEvents = sortedEvents.filter(
          event => new Date(event.start_time).getTime() > now,
        )

        setLastEvent(pastEvents.length ? pastEvents[pastEvents.length - 1] : null)
        setNextEvent(futureEvents.length ? futureEvents[0] : null)
      } catch (error) {
        console.error('Failed to load events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [user])

  // Function to format event duration
  const getDuration = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime()
    const minutes = Math.floor(diffMs / (1000 * 60))
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading)
    return (
      <Card className="w-full rounded-xl">
        <CardContent className="py-6">
          <p className="animate-pulse text-center">Loading events...</p>
        </CardContent>
      </Card>
    )

  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="text-center">
        <CardTitle>Demand Response Events</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {nextEvent ? (
          <div className="w-full text-center p-4 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">Next Event</h3>
            <div className="bg-green-100 dark:bg-green-900/40 rounded-xl p-2 mb-2 inline-block">
              {formatDate(nextEvent.start_time)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Duration: {getDuration(nextEvent.start_time, nextEvent.end_time)}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-4">No upcoming events.</p>
        )}

        {lastEvent ? (
          <div className="w-full text-center p-4 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">Last Event</h3>
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-2 mb-2 inline-block">
              {formatDate(lastEvent.start_time)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Duration: {getDuration(lastEvent.start_time, lastEvent.end_time)}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-4">No past events.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default DemandResponseEvent
