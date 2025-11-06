import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none fluent-transition',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary border-primary/20 fluent-shadow-xs [a&]:hover:bg-primary/15 [a&]:hover:fluent-shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground border-transparent fluent-shadow-xs [a&]:hover:bg-[var(--secondary-hover)] [a&]:hover:fluent-shadow-sm',
        destructive:
          'bg-destructive/10 text-destructive border-destructive/20 fluent-shadow-xs [a&]:hover:bg-destructive/15 [a&]:hover:fluent-shadow-sm',
        outline:
          'border-border bg-background/60 backdrop-blur-sm text-foreground fluent-shadow-xs [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:border-[var(--border-hover)]',
        success:
          'bg-success/10 text-success border-success/20 fluent-shadow-xs [a&]:hover:bg-success/15 [a&]:hover:fluent-shadow-sm',
        warning:
          'bg-warning/10 text-warning-foreground border-warning/20 fluent-shadow-xs [a&]:hover:bg-warning/15 [a&]:hover:fluent-shadow-sm',
        accent:
          'bg-accent/10 text-accent border-accent/20 fluent-shadow-xs [a&]:hover:bg-accent/15 [a&]:hover:fluent-shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
