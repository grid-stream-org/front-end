import { Bell } from 'lucide-react'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'

export const NotificationBell = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="hover:cursor-pointer">Notication 1</DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer">Notication 2</DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer">Notification 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
