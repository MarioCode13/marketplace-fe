import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const variantCVA = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'shadow  active:scale-95',
        outline: 'border active:scale-95 bg-transparent',
        ghost: 'hover:bg-accent/10 active:scale-95 bg-transparent',
        link: 'underline-offset-4 hover:underline',
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
      variant: 'default',
      size: 'default',
    },
  }
)

const colorCVA = cva('', {
  variants: {
    btnColor: {
      gradient:
        'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl active:scale-95 hover:from-blue-700 hover:to-purple-700',
      primary: 'bg-primary  hover:bg-primaryHover',
      secondary: 'bg-secondary text-foreground hover:bg-secondaryHover',
      destructive: 'bg-destructive text-white hover:bg-destructive/90',
      outlinePrimary:
        'border border-primary text-primary brightness-150 hover:brightness-100 hover:bg-primary hover:text-white hover:opacity-80',
      outlineSecondary:
        'border border-secondary brightness-200 text-white  hover:brightness-100  hover:bg-secondary',
      ghost: 'text-foreground hover:bg-secondary transition-color duration-300',
    },
  },
  defaultVariants: {
    btnColor: 'primary',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantCVA>,
    VariantProps<typeof colorCVA> {
  // btnColor is included here
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, btnColor, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          variantCVA({ variant, size }),
          colorCVA({ btnColor }),
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
