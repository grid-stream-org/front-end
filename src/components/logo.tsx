import { HTMLAttributes } from 'react'

import Icon from '@/assets/icon.svg'
import { Image } from '@/components/ui'
import { cn } from '@/lib/utils'

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'loading'
}

export const Logo = ({ className, showText = true, size = 'md', ...props }: LogoProps) => {
  const sizeClasses = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-md',
      gap: 'gap-1',
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-md',
      gap: 'gap-1',
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-2xl',
      gap: 'gap-3',
    },
    xl: {
      icon: 'h-12 w-12',
      text: 'text-3xl',
      gap: 'gap-3',
    },
    xxl: {
      icon: 'h-16 w-16',
      text: 'text-4xl',
      gap: 'gap-3',
    },
    loading: {
      icon: 'h-20 w-20',
      text: '',
      gap: '',
    },
  }

  return (
    <div
      className={cn('flex items-center justify-center', sizeClasses[size].gap, className)}
      {...props}
    >
      <Image src={Icon} alt="GridStream" className={sizeClasses[size].icon} />
      {showText && (
        <span className={cn('font-semibold text-primary font-montserrat', sizeClasses[size].text)}>
          GRIDSTREAM
        </span>
      )}
    </div>
  )
}
