import React from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  title,
}: DrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-[55] transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm sm:min-w-[24rem] bg-componentBackground dark:bg-componentBackground shadow-lg px-6 py-6 z-[60] transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex justify-between items-center mb-4'>
          {title ? (
            <h2 className='text-lg font-semibold text-foreground dark:text-foregroundDark'>
              {title}
            </h2>
          ) : (
            <div></div>
          )}
          <Button
            variant={'ghost'}
            btnColor={'ghost'}
            size={'icon'}
            onClick={onClose}
            className='text-foreground dark:text-foregroundDark rounded-full'
          >
            <X
              className='!w-7 !h-7'
              strokeWidth={3}
            />
          </Button>
        </div>
        {/* Content (scrollable) */}
        <div className='flex-1 min-h-0 overflow-y-auto'>{children}</div>
      </div>
    </>
  )
}
