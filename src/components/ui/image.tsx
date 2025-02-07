import { ComponentProps, useEffect, useState } from 'react'

import { Skeleton } from '@/components/ui'
import { cn } from '@/lib'

export const Image = ({ className, ...props }: ComponentProps<'img'>) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setLoaded(true)
    img.src = props.src ?? ''
  }, [props.src])

  return (
    <>
      <Skeleton className={cn(loaded ? 'hidden' : 'inline', className)} />
      <img
        src={props.src}
        alt={props.alt}
        className={cn(!loaded ? 'hidden' : 'inline', className)}
      />
    </>
  )
}
