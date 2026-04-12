import * as React from 'react'
import { cn } from '@/lib/utils'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className='relative overflow-hidden rounded-xl'>
    {/* Glassmorphism background layers */}
    <div className='absolute inset-0 bg-gradient-to-br from-black/5 via-black/2 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent backdrop-blur-md' />
    <div className='absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-accent/5 backdrop-blur-sm' />
    <div className='absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-transparent' />

    <table
      ref={ref}
      className={cn('w-full text-sm relative z-10 ', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'relative bg-gradient-to-r from-black/5 via-black/5 to-slate-100/50 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-sm hover:pointer-events-none',
      className,
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-black/5 dark:divide-white/5', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-all duration-200 hover:bg-gradient-to-r hover:from-[rgba(97,137,178,0.15)] hover:to-[rgba(21,208,250,0.15)] hover:shadow-sm hover:scale-[1.002]',
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-semibold text-foreground border-b border-black/10 dark:border-white/10',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-foreground/80', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
