import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Notification } from '@/types'

type NotificationModalProps = {
  notification: Notification | null
  onClose: () => void
}

export const NotificationModal = ({ notification, onClose }: NotificationModalProps) => {
  if (!notification) return null

  return (
    <Dialog open={!!notification} onOpenChange={onClose}>
      <DialogContent className="bg-popover text-popover-foreground border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Notification Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {notification.message}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            <strong>Start:</strong>{' '}
            {notification.start_time
              ? new Date(notification.start_time.seconds * 1000).toLocaleString()
              : 'No start time'}
          </p>
          <p>
            <strong>End:</strong>{' '}
            {notification.end_time
              ? new Date(notification.end_time.seconds * 1000).toLocaleString()
              : 'No end time'}
          </p>
        </div>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
