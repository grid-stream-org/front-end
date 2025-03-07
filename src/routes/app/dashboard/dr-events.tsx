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
      try {
        if (!user) return
        const data = await fetchEvents(user)

        // Sort events for recent and next
        const sortedEvents = data.sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
        )

        const now = new Date().getTime()
        const pastEvents = sortedEvents.filter(event => new Date(event.end_time).getTime() < now)
        const mostRecentEvent = pastEvents.length ? pastEvents[pastEvents.length - 1] : null

        // Find next event (earliest future event)
        const futureEvents = sortedEvents.filter(
          event => new Date(event.start_time).getTime() > now,
        )
        const upcomingEvent = futureEvents.length ? futureEvents[0] : null

        setLastEvent(mostRecentEvent)
        setNextEvent(upcomingEvent)
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

  if (loading) return <p>Loading...</p>
  if (!nextEvent && !lastEvent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demand Response Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No demand response events scheduled.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Response Events</CardTitle>
      </CardHeader>
      <CardContent>
        {nextEvent ? (
          <p>
            <strong>Next Event:</strong> {new Date(nextEvent.start_time).toLocaleString()}
          </p>
        ) : (
          <p>No upcoming events.</p>
        )}

        {lastEvent ? (
          <p>
            <strong>Last Event:</strong> {new Date(lastEvent.start_time).toLocaleString()}
          </p>
        ) : (
          <p>No past events.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default DemandResponseEvent
