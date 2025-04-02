import { Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DREvent } from '@/types'

export const DemandResponseEvent = ({ events }: { events: DREvent[] }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<DREvent[]>([])
  const [currEvent, setCurrEvents] = useState<DREvent | null>(null)
  const [lastEvent, setLastEvent] = useState<DREvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Sort events by start time
        const sortedEvents = events
          .filter(event => event.start_time) // Ensure valid start times
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

        const now = Date.now()
        const currEvent = sortedEvents.filter(
          event =>
            new Date(event.start_time).getTime() < now && now < new Date(event.end_time).getTime(),
        )
        const pastEvents = sortedEvents.filter(event => new Date(event.end_time).getTime() < now)
        const futureEvents = sortedEvents.filter(
          event => new Date(event.start_time).getTime() > now,
        )
        setCurrEvents(currEvent.length ? currEvent[0] : null)
        setLastEvent(pastEvents.length ? pastEvents[pastEvents.length - 1] : null)
        // Get up to 3 upcoming events
        setUpcomingEvents(futureEvents.slice(0, 3))
      } catch (error) {
        console.error('Failed to load events:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [events])

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  // Format time for display
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate event duration in hours and minutes - with safeguard against negative durations
  const getEventDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime())
    const minutes = Math.floor(diffMs / (1000 * 60))
    return minutes < 60 ? `${minutes} minutes` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  // Calculate days until event
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const currentDate = new Date()

    const diffTime = date.getTime() - currentDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `In ${diffDays} days`
  }

  // Function to shorten event ID for display
  const shortenId = (id: string) => {
    if (!id) return ''
    if (id.length <= 12) return id
    return id.substring(0, 8) + '...'
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between gap-2 border-b py-5 sm:flex-row">
        <CardTitle>Demand Response Events</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line - hide on small screens */}
            {currEvent != null && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted ml-3.5 z-0 hidden sm:block"></div>
            )}

            <div className="space-y-6 relative z-10">
              {currEvent && (
                <div key={currEvent.id} className="flex gap-2 sm:gap-4">
                  {/* Timeline circle - responsive size */}
                  <div className="relative flex-shrink-0 flex flex-col items-center pt-2 sm:flex">
                    <div className="rounded-full border-4 border-green-400 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center z-10 bg-green-500">
                      {/* <span className="text-xs font-bold text-primary-foreground">1</span> */}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 gap-1">
                      <div>
                        <h4 className="font-semibold text-base">Current Demand Response Event</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-full sm:max-w-[240px]">
                          ID: {shortenId(currEvent.id)}
                        </p>
                      </div>
                      <Badge variant="default" className="self-start shrink-0 bg-green-500">
                        Active
                      </Badge>
                    </div>

                    <div className="bg-card border rounded-md p-3 mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">
                            {formatEventDate(currEvent.start_time)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm whitespace-nowrap">
                            {formatEventTime(currEvent.start_time)}
                            <ArrowRight className="h-3 w-3 inline mx-1" />
                            {formatEventTime(currEvent.end_time)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t flex-wrap gap-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-1 font-medium">
                            {getEventDuration(currEvent.start_time, currEvent.end_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-2 sm:gap-4">
                    {/* Timeline circle - responsive size */}
                    <div className="relative flex-shrink-0 flex flex-col items-center pt-2 sm:flex">
                      <div
                        className={`rounded-full border-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center z-10 
                                      ${index === 0 ? 'bg-primary border-primary/20' : 'bg-muted border-muted/20'}`}
                      >
                        <span className="text-xs font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 gap-1">
                        <div>
                          <h4 className="font-semibold text-base">Next Demand Response Event</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-full sm:max-w-[240px]">
                            ID: {shortenId(event.id)}
                          </p>
                        </div>
                        <Badge
                          variant={index === 0 ? 'default' : 'outline'}
                          className="self-start shrink-0"
                        >
                          {getDaysUntil(event.start_time)}
                        </Badge>
                      </div>

                      <div className="bg-card border rounded-md p-3 mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">
                              {formatEventDate(event.start_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">
                              {formatEventTime(event.start_time)}
                              <ArrowRight className="h-3 w-3 inline mx-1" />
                              {formatEventTime(event.end_time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t flex-wrap gap-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="ml-1 font-medium">
                              {getEventDuration(event.start_time, event.end_time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No upcoming events scheduled
                </div>
              )}

              {/* Last completed event */}
              {lastEvent && (
                <div className="mt-8 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <h3 className="font-medium">Last Completed Event</h3>
                  </div>

                  <div className="bg-card border rounded-md p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">
                          {formatEventDate(lastEvent.start_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm whitespace-nowrap">
                          {formatEventTime(lastEvent.start_time)}
                          <ArrowRight className="h-3 w-3 inline mx-1" />
                          {formatEventTime(lastEvent.end_time)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 pt-2 border-t gap-2">
                      <div className="text-sm truncate">
                        <span className="text-muted-foreground">Event ID:</span>
                        <span className="ml-1 font-medium">{shortenId(lastEvent.id)}</span>
                      </div>
                      <div className="text-sm whitespace-nowrap">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-1 font-medium">
                          {getEventDuration(lastEvent.start_time, lastEvent.end_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {events.length > 3 && (
          <div className="mt-6 flex justify-end">
            <Button variant="outline" size="sm">
              View All Events
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
