// components/GenericError.tsx
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface GenericErrorProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export const GenericError = ({ error, resetErrorBoundary }: GenericErrorProps) => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>

      <Button onClick={resetErrorBoundary} className="min-w-[200px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Try Again
      </Button>
    </div>
  )
}
