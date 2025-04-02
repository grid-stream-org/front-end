import {
  LucideIcon,
  LayoutDashboard,
  ScrollText,
  Gauge,
  Calendar,
  SatelliteDish,
  BadgeCheck,
} from 'lucide-react'
import { Location, RouteObject } from 'react-router-dom'

interface Route {
  title: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
}

interface AppRoute extends Route {
  description: string
  icon: LucideIcon
}

const authRoutes: Route[] = [
  {
    title: 'Login',
    path: 'login',
    component: () => import('@/routes/login'),
  },
  {
    title: 'Register',
    path: 'register',
    component: () => import('@/routes/register'),
  },
]

const publicRoutes: Route[] = [
  {
    title: 'Landing',
    path: '/',
    component: () => import('@/routes/landing'),
  },
  {
    title: '404 Not Found',
    path: '*',
    component: () => import('@/routes/not-found'),
  },
]

const protectedRoutes: AppRoute[] = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: LayoutDashboard,
    description: 'View key metrics and overview of your grid',
    component: () => import('@/routes/app/dashboard'),
  },
  {
    title: 'Monitoring',
    path: 'monitoring',
    icon: Gauge,
    description: 'Monitor real-time power flow and device performance across your residence',
    component: () => import('@/routes/app/monitoring'),
  },
  {
    title: 'Events',
    path: 'events',
    icon: Calendar,
    description: 'Track prior, current, and future demand response events',
    component: () => import('@/routes/app/events'),
  },
  {
    title: 'Contracts',
    path: 'contracts',
    icon: ScrollText,
    description: 'Manage and review your contracts and agreements',
    component: () => import('@/routes/app/contracts'),
  },
  {
    title: 'Devices',
    path: 'devices',
    icon: SatelliteDish,
    description: 'View and manage your distributed energy resources',
    component: () => import('@/routes/app/devices'),
  },
]

const hiddenProtectedRoutes: AppRoute[] = [
  {
    title: 'Account Management',
    icon: BadgeCheck,
    description: 'Manage and review your account',
    path: 'account',
    component: () => import('@/routes/app/account'),
  },
]

const utilityRoutes: AppRoute[] = [
  {
    title: 'Dashboard',
    path: 'utility/dashboard',
    icon: LayoutDashboard,
    description: 'soething ustilyView key metrics and overview of your grid',
    component: () => import('@/routes/app/utility/dashboard'),
  },
  // {
  //   title: 'Monitoring',
  //   path: 'monitoring',
  //   icon: Gauge,
  //   description: 'Monitor real-time power flow and device performance across your residence',
  //   component: () => import('@/routes/app/monitoring'),
  // },
  {
    title: 'Events',
    path: 'utility/events',
    icon: Calendar,
    description: 'Track prior, current, and future demand response events',
    component: () => import('@/routes/app/utility/events'),
  },
  // {
  //   title: 'Contracts',
  //   path: 'contracts',
  //   icon: ScrollText,
  //   description: 'Manage and review your contracts and agreements',
  //   component: () => import('@/routes/app/contracts'),
  // },
  // {
  //   title: 'Devices',
  //   path: 'devices',
  //   icon: SatelliteDish,
  //   description: 'View and manage your distributed energy resources',
  //   component: () => import('@/routes/app/devices'),
  // },
]

export const routes = [...publicRoutes, ...protectedRoutes, ...authRoutes, ...hiddenProtectedRoutes]

export const getTitle = (pathname: string): string | undefined => {
  const path = pathname.includes('app') ? pathname.split('/app/')[1] : pathname.replace('/', '')
  const route = routes.find(route => route.path === path)
  return route?.title
}

export const isActiveRoute = (path: string, location: Location): boolean => {
  const appPath = location.pathname.split('/app/')[1]
  return appPath === path
}

export const isAppRoute = (route: Route): route is AppRoute =>
  'icon' in route && 'component' in route && 'description' in route

export const getAppRoute = (pathname: string): AppRoute | undefined => {
  let path = undefined
  if (pathname.includes('utility')) {
    path = pathname.includes('utility') ? pathname.split('utility/')[1] : pathname.replace('/', '')
  } else {
    path = pathname.includes('app') ? pathname.split('/app/')[1] : pathname.replace('/', '')
  }

  return [...protectedRoutes, ...hiddenProtectedRoutes, ...utilityRoutes].find(
    route => route.path === path,
  )
}

export const getAppRoutes = (): AppRoute[] => routes.filter(isAppRoute)

export const getAppPath = (route: AppRoute) => `/app/${route.path}`

export const createRouteConfig = (route: Route): RouteObject => ({
  path: route.path,
  lazy: route.component,
})

export type { Route, AppRoute }
export { protectedRoutes, publicRoutes, authRoutes, hiddenProtectedRoutes, utilityRoutes }
