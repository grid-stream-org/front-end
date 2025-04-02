import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DemandResponseEventProps {
  nextEventId: string | null
  nextEventStart: string | null
  nextEventEnd: string | null
  recentEventId: string | null
  recentEventStart: string | null
  recentEventEnd: string | null
}

export const DemandResponseEvent = ({ events }: { events: DemandResponseEventProps }) => {
  const getDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return ''

    const diffMs = new Date(end).getTime() - new Date(start).getTime()
    const minutes = Math.floor(diffMs / (1000 * 60))
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Demand Response Events</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {events.nextEventId && events.nextEventStart && events.nextEventEnd ? (
          <div className="w-full text-center p-4 rounded-xl border">
            <h3 className="font-semibold text-2xl mb-2">Next Event</h3>
            <div className="text-2xl bg-green-300 dark:bg-green-600 rounded-xl p-2 mb-2 inline-block">
              {formatDate(events.nextEventStart)}
            </div>
            <div className="text-lg text-muted-foreground mt-1">
              Duration: {getDuration(events.nextEventStart, events.nextEventEnd)}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-4">No upcoming events.</p>
        )}

        {events.recentEventId && events.recentEventStart && events.recentEventEnd ? (
          <div className="w-full text-center p-4 rounded-xl border">
            <h3 className="font-semibold text-2xl mb-2">Last Event</h3>
            <div className="text-2xl bg-blue-300 dark:bg-blue-600 rounded-xl p-2 mb-2 inline-block">
              {formatDate(events.recentEventStart)}
            </div>
            <div className="text-lg text-muted-foreground mt-1">
              Duration: {getDuration(events.recentEventStart, events.recentEventEnd)}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center p-4">No past events.</p>
        )}
      </CardContent>
    </Card>
  )
}
