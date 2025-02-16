import { ReactNode } from 'react'

import { AppRoute } from '@/config'
import { cn } from '@/lib'

export const PageTitle = ({
  route,
  children,
  className,
}: {
  route: AppRoute | undefined
  children?: ReactNode
  className?: string
}) => (
  <div className={cn('flex justify-between items-center pb-4', className)}>
    <div className="flex flex-col gap-1">
      <h1 className="text-xl">{route && route.title}</h1>
      <p className="text-sm text-muted-foreground">{route && route.description}</p>
    </div>
    {children}
  </div>
)
