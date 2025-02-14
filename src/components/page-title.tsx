import { ReactNode } from 'react'

import { AppRoute } from '@/config'

export const PageTitle = ({
  route,
  children,
}: {
  route: AppRoute | undefined
  children?: ReactNode
}) => (
  <div className="flex justify-between items-center">
    <div className="flex flex-col gap-1 pb-4">
      <h1 className="text-xl">{route && route.title}</h1>
      <p className="text-sm text-muted-foreground">{route && route.description}</p>
    </div>
    {children}
  </div>
)
