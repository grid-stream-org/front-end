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
        const data = await fetchEvents(user, 'Residential')
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

  const renderEventsList = (eventsList: DREvent[]) => {
    if (loading) {
      return [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
    }

    if (eventsList.length > 0) {
      return eventsList.map(event => <EventCard key={event.id} event={event} />)
    }

    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">No events found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <PageTitle route={getAppRoute(location.pathname)} />
      <SummaryCards items={summaryItems} />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">{renderEventsList(upcomingEvents)}</TabsContent>

        <TabsContent value="active">{renderEventsList(activeEvents)}</TabsContent>

        <TabsContent value="past">{renderEventsList(pastEvents)}</TabsContent>
      </Tabs>
    </div>
  )
}

export default EventsPage
