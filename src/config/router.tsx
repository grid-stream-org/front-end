import { createBrowserRouter } from 'react-router-dom'

import { GenericError } from '@/components/generic-error'
import { AppLayout, AuthLayout, ProtectedRoute, RootLayout } from '@/config/lazy'
import { authRoutes, publicRoutes, protectedRoutes, createRouteConfig } from '@/config/routes'
import NotFoundPage from '@/routes/not-found/page'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GenericError />,
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
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
