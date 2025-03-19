import * as React from 'react'
import { cn } from '@/lib/utils'
import { ImageIcon, Loader2 } from 'lucide-react'

const FileInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { loading?: boolean }
>(({ className, loading, ...props }, ref) => {
  const labelContent = loading ? (
    <>
      <Loader2 className='animate-spin' />
      <ImageIcon
        size={18}
        className='ml-2'
      />
    </>
  ) : (
    <>
      Upload
      <ImageIcon
        size={18}
        className='ml-2'
      />
    </>
  )

  return (
    <div className='relative flex items-center'>
      <label
        htmlFor={props.id || 'file-upload'}
        className={cn(
          'cursor-pointer rounded-sm border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors flex items-center text-center',
          {
            'opacity-30 min-w-[101px] justify-between': loading,
            'hover:bg-secondary hover:text-accent-foreground': !loading,
          }
        )}
      >
        {labelContent}
      </label>

      <input
        id={props.id || 'file-upload'}
        type='file'
        className={cn('hidden', className)}
        ref={ref}
        disabled={loading}
        {...props}
      />
    </div>
  )
})

FileInput.displayName = 'FileInput'

export { FileInput }
