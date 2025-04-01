import { Timestamp } from '@firebase/firestore'
import { Calendar, Clock } from 'lucide-react'

import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Notification } from '@/types'

type NotificationModalProps = {
  notification: Notification | null
  onClose: () => void
}

export const NotificationModal = ({ notification, onClose }: NotificationModalProps) => {
  if (!notification) return null

  const formatDateTime = (timestamp: Timestamp) => {
    if (!timestamp) return 'Not specified'

    const date = new Date(timestamp.seconds * 1000)

    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <Dialog open={!!notification} onOpenChange={onClose}>
      <DialogContent className="bg-popover text-popover-foreground border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Notification Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {notification.message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Start Time</p>
              <p className="text-muted-foreground">{formatDateTime(notification.start_time)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">End Time</p>
              <p className="text-muted-foreground">{formatDateTime(notification.end_time)}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
