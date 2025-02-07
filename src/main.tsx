import { Suspense, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider } from 'react-router-dom'

import { GenericError, LoadingScreen } from '@/components'
import { router } from '@/config'
import { ThemeProvider, AuthProvider } from '@/context'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<GenericError />} onReset={() => window.location.reload()}>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
