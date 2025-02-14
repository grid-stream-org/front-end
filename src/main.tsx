import { Suspense, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { router } from '@/config'
import { ThemeProvider, AuthProvider } from '@/context'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
