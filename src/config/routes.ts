import { LucideIcon, LayoutDashboard } from 'lucide-react'
import { Location, RouteObject } from 'react-router-dom'

interface Route {
  title: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
}

interface AppRoute extends Route {
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
    component: () => import('@/routes/app/dashboard'),
  },
]

export const routes = [...publicRoutes, ...protectedRoutes, ...authRoutes]

export const getTitle = (location: Location): string | undefined => {
  const pathname = location.pathname
  const path = pathname.includes('app') ? pathname.split('/app/')[1] : pathname.replace('/', '')
  const route = routes.find(route => route.path === path)
  return route?.title
}

export const isActiveRoute = (path: string, location: Location): boolean => {
  const appPath = location.pathname.split('/app/')[1]
  return appPath === path
}

export const isAppRoute = (route: Route): route is AppRoute => {
  return 'icon' in route && 'component' in route
}

export const getAppRoutes = (): AppRoute[] => {
  return routes.filter(isAppRoute)
}

export const createRouteConfig = (route: Route): RouteObject => ({
  path: route.path,
  lazy: route.component,
})

export type { Route, AppRoute }
export { protectedRoutes, publicRoutes, authRoutes }
