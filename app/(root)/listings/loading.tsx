import { ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'

export default function LoadingListings() {
  return (
    <div className='w-full flex justify-center'>
      <div className='flex flex-col items-center p-6 w-full max-w-7xl'>
        {/* Header */}
        <div className='flex items-center justify-between w-full mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              aria-label='Open filters'
              variant='outlined'
              color='primary'
              size='icon'
              className='rounded-full p-3'
              disabled
            >
              <ListFilter
                className='!w-5 !h-5'
                strokeWidth={2}
              />
            </Button>
          </div>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>Available Listings</h1>
          </div>
          <div className='w-12'></div>
        </div>

        {/* Filters indicator skeleton */}
        <div className='w-full mb-4 p-3 bg-muted rounded-lg animate-pulse'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground flex-wrap'>
            <div className='w-4 h-4 bg-muted-foreground/20 rounded' />
            <div className='w-24 h-4 bg-muted-foreground/20 rounded' />
          </div>
        </div>

        {/* Count skeleton */}
        <div className='w-full mb-4'>
          <div className='w-32 h-4 bg-muted-foreground/20 rounded animate-pulse' />
        </div>

        {/* Listings skeleton grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonListingCard key={i} />
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className='flex items-center justify-center gap-4 mt-8'>
          <Button
            size='icon'
            variant='outlined'
            color='primary'
            className='rounded-full'
            disabled
          >
            <div className='w-4 h-4 bg-muted-foreground/20 rounded' />
          </Button>
          <div className='w-16 h-4 bg-muted-foreground/20 rounded animate-pulse' />
          <Button
            size='icon'
            variant='outlined'
            color='primary'
            className='rounded-full'
            disabled
          >
            <div className='w-4 h-4 bg-muted-foreground/20 rounded' />
          </Button>
        </div>
      </div>
    </div>
  )
}
