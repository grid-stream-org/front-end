import { createBrowserRouter } from 'react-router-dom'

import { AppLayout, AuthLayout, ProtectedRoute, RootLayout } from '@/config/lazy'
import { authRoutes, publicRoutes, protectedRoutes, createRouteConfig } from '@/config/routes'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      ...publicRoutes.map(createRouteConfig),
      {
        element: <AuthLayout />,
        children: authRoutes.map(createRouteConfig),
      },
      {
        path: 'app',
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: protectedRoutes.map(createRouteConfig),
          },
        ],
      },
    ],
  },
])
