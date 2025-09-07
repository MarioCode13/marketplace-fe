import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 ',
  {
    variants: {
      variant: {
        contained: 'shadow active:scale-95',
        outlined: 'border-[1px] shadow active:scale-95 bg-transparent',
        text: 'active:scale-95 bg-transparent hover:bg-secondary ',
      },
      color: {
        primary:
          'text-primary hover:scale-[101%] [&.contained]:bg-primary [&.contained]:hover:bg-primaryHover [&.contained]:text-white [&.outlined]:border-primary [&.outlined]:hover:border-primaryHover [&.outlined]:hover:text-primaryHover [&.text]:hover:bg-primary/10',
        secondary:
          'text-secondary hover:scale-[101%] [&.contained]:bg-secondary [&.contained]:hover:bg-secondaryHover [&.contained]:text-contrast [&.outlined]:border-secondary [&.outlined]:hover:border-secondaryHover [&.outlined]:hover:text-secondaryHover [&.text]:hover:bg-secondary/10',
        destructive:
          'text-destructive hover:scale-[101%] [&.contained]:bg-destructive [&.contained]:hover:bg-destructive/90 [&.contained]:text-white [&.outlined]:border-destructive [&.text]:hover:bg-destructive/10',
        gradient:
          'hover:scale-[101%] [&.contained]:bg-gradient-to-r [&.contained]:from-blue-600 [&.contained]:to-purple-600 [&.contained]:hover:from-blue-700 [&.contained]:hover:to-purple-700 [&.contained]:text-white [&.contained]:shadow-lg [&.contained]:hover:shadow-xl [&.outlined]:border-blue-600 [&.outlined]:text-primary [&.text]:text-blue-600 [&.text]:hover:bg-blue-50',
        input:
          'bg-input font-medium text-foreground [&.contained]:hover:bg-accent [&.outlined]:border-input [&.text]:hover:bg-accent/10',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-8',
        xl: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'contained',
      color: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, color, size }),
          variant,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export { Button }
