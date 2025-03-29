'use client'

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/context'
import { UserRole } from '@/types'

export const NavUser = ({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    projectId: string
    role: UserRole
  }
}) => {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const getInitials = (name: string): string => {
    if (!name) {
      return 'U'
    }

    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
  }

  const handleAccountManagement = () => {
    navigate('/app/account')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs">Email: {user.email}</span>
                  <span className="text-xs">
                    {user.role === UserRole.UTILITY ? 'Utility ID: ' : 'Project ID: '}
                    {user.projectId}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAccountManagement} className="hover:cursor-pointer">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="hover:cursor-pointer">
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem className="hover:cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="hover:cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
