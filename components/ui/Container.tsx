import * as React from 'react'
import { cn } from '@/lib/utils'

const containerWidths = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

type ContainerSize = keyof typeof containerWidths

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
}

export function Container({
  size = '7xl',
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        containerWidths[size],
        className,
      )}
      {...props}
    />
  )
}
