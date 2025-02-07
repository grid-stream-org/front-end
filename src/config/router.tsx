import { LucideIcon, LayoutDashboard } from 'lucide-react'
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const AppLayout = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.AppLayout }
})

const AuthLayout = lazy(async () => {
  const module = await import('@/layouts')
  return { default: module.AuthLayout }
})

const ProtectedRoute = lazy(async () => {
  const module = await import('@/routes')
  return { default: module.ProtectedRoute }
})

export interface Route {
  title: string
  path: string
  icon: LucideIcon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
}

const routes: Route[] = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: LayoutDashboard,
    component: () => import('@/routes/app/dashboard'),
  },
]

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/routes/landing'),
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        lazy: () => import('@/routes/login'),
      },
      {
        path: '/register',
        lazy: () => import('@/routes/register'),
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout routes={routes} />,
        children: routes.map(route => ({
          path: route.path,
          lazy: route.component,
        })),
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('@/routes/not-found'),
  },
])
