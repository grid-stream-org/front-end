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
import { Route } from '@/config'
import { useAuth } from '@/context'

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  routes: Route[]
}

export const AppSidebar = ({ routes, ...props }: AppSidebarProps) => {
  const { open } = useSidebar()
  const location = useLocation()
  const { user } = useAuth()

  const isActiveRoute = (route: Route) => location.pathname.split('/app/')[1] === route.path

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
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
                  <SidebarMenuButton asChild isActive={isActiveRoute(route)}>
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
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
