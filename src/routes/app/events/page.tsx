import { Calendar, Clock, ListChecks } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { EventCard } from './event-card'
import { SkeletonCard } from './skeleton-card'

import { SummaryCards } from '@/components'
import { PageTitle } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { fetchEvents } from '@/hooks'
import { DREvent } from '@/types'

const EventsPage = () => {
  const [events, setEvents] = useState<DREvent[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { user } = useAuth()
  const now = new Date()
  const upcomingEvents = events.filter(e => new Date(e.start_time) > now)
  const activeEvents = events.filter(e => {
    const start = new Date(e.start_time)
    const end = new Date(e.end_time)
    return start <= now && end >= now
  })
  const pastEvents = events.filter(e => new Date(e.end_time) < now)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (!user) return
        const data = await fetchEvents(user)
        setEvents(data)
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

  const summaryItems = [
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      subtitle: 'Scheduled for future',
    },
    {
      title: 'Active Events',
      value: activeEvents.length,
      icon: Clock,
      subtitle: 'Currently in progress',
    },
    {
      title: 'Past Events',
      value: pastEvents.length,
      icon: ListChecks,
      subtitle: 'Successfully completed',
    },
  ]

  return (
    <div>
      <PageTitle route={getAppRoute(location.pathname)} />
      <SummaryCards items={summaryItems} />
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full mb-4 sm:mb-6">
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1">
            Active Events
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            Past Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-center text-muted-foreground">No upcoming events scheduled</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active">
          {loading ? (
            [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
          ) : activeEvents.length > 0 ? (
            activeEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-center text-muted-foreground">No active events</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
          ) : pastEvents.length > 0 ? (
            pastEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-center text-muted-foreground">No past events found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EventsPage
