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
      {/* Overlay with fade-in/out */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-[55] transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar with slide-in animation */}
      <div
        className={`fixed top-0 left-0 h-full min-w-[26rem] bg-componentBackground dark:bg-componentBackground shadow-lg px-12 py-10 z-[60] transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          {title && (
            <h2 className='text-lg font-semibold text-foreground dark:text-foregroundDark'>
              {title}
            </h2>
          )}
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={onClose}
            className='text-foreground dark:text-foregroundDark rounded-full'
          >
            <X
              className='!w-5 !h-5'
              strokeWidth={3}
            />
          </Button>
        </div>

        {children}
      </div>
    </>
  )
}
