import { ComponentProps } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Logo } from '@/components'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  NavUser,
  useSidebar,
} from '@/components/ui'
import { protectedRoutes, isActiveRoute, utilityRoutes } from '@/config'
import { useAuth } from '@/context'
import { UserRole } from '@/types'

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar()
  const location = useLocation()
  const { user } = useAuth()
  const routes = user?.role === UserRole.RESIDENTIAL ? protectedRoutes : utilityRoutes

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="dashboard">
          <Logo showText={open} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map(route => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild isActive={isActiveRoute(route.path, location)}>
                    <Link to={route.path}>
                      <route.icon />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user!.displayName!,
            email: user!.email!,
            avatar: user!.photoURL!,
            projectId: user!.projectId,
            role: user!.role,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
