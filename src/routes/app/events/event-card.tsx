import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  CircuitBoard,
  ActivitySquare,
  CheckCircle2,
  Clock,
  CalendarClock,
  CalendarCheck,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { EventCardProps } from '@/types'

export const EventCard = ({ event }: EventCardProps) => {
  const now = new Date()
  const start = new Date(event.start_time)
  const end = new Date(event.end_time)
  const isActive = start <= now && end >= now
  const isPast = end < now

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={`relative rounded-xl bg-card shadow-md mb-6 transition-all duration-300 hover:shadow-lg`}
      >
        {/* top accent bar */}
        <div
          className={`absolute inset-x-0 top-0 h-1 rounded-t-xl ${
            isActive ? 'bg-green-500' : isPast ? 'bg-gray-400' : 'bg-blue-500'
          }`}
        />

        <CardContent className="pt-6 px-6 pb-5">
          {/* Header with Status */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-lg font-semibold mb-1 text-foreground">Event {event.id}</h3>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <CircuitBoard className="h-4 w-4 text-primary" />
                <span>Utility: {event.utility_id}</span>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : isPast
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isActive ? (
                <>
                  <ActivitySquare className="h-3 w-3" />
                  Active
                </>
              ) : isPast ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  Upcoming
                </>
              )}
            </span>
          </div>

          {/* Event Times */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CalendarClock className="h-4 w-4 text-primary" />
                <span>Start Time</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{format(start, 'PPpp')}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <span>End Time</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{format(end, 'PPpp')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
