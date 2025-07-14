'use client'
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import FilterDrawer from '@/components/drawers/FilterDrawer'
import { Button } from '@/components/ui/button'
import { GET_CATEGORIES, GET_LISTINGS } from '@/lib/graphql/queries'
import { ChevronLeft, ChevronRight, ListFilter, Search } from 'lucide-react'
import ListingCard from '@/components/cards/ListingCard'

interface Listing {
  id: string
  title: string
  description: string
  price: string
  images: string[]
  createdAt: string
  category: {
    id: string
    name: string
  }
  condition: string
  location: string
  user: {
    id: string
    username: string
    trustRating?: {
      overallScore: number
      starRating: number
      trustLevel: string
      totalReviews: number
      positiveReviews: number
    }
  }
}

interface Filters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  location?: string
  searchTerm?: string
  minDate?: string
  maxDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export default function ListingsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})
  const [limit] = useState(9)
  const [offset, setOffset] = useState(0)

  const { loading, error, data } = useQuery(GET_LISTINGS, {
    variables: {
      limit,
      offset,
      ...filters,
    },
    fetchPolicy: 'cache-and-network',
  })

  const { data: categoriesData } = useQuery(GET_CATEGORIES)

  const listings: Listing[] = data?.getListings?.listings || []
  const totalCount: number = data?.getListings?.totalCount || 0

  const handleNext = () => {
    if (offset + limit < totalCount) setOffset(offset + limit)
  }

  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters)
    setOffset(0) // Reset to first page when filters change
  }

  const hasActiveFilters = () => {
    return (
      Object.keys(filters).length > 0 &&
      Object.values(filters).some(
        (value) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    )
  }

  const clearAllFilters = () => {
    setFilters({})
    setOffset(0)
  }

  return (
    <div className='w-full flex justify-center'>
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        categories={categoriesData?.getCategories || []}
        currentFilters={filters}
      />

      <div className='flex flex-col items-center p-6 w-full max-w-7xl'>
        {/* Header with filters and search */}
        <div className='flex items-center justify-between w-full mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={() => setIsFilterOpen(true)}
              variant={'outline'}
              size={'icon'}
              className='rounded-full p-3'
            >
              <ListFilter
                className='!w-5 !h-5'
                strokeWidth={2}
              />
            </Button>
          </div>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>Available Listings</h1>
            {hasActiveFilters() && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='text-sm'
              >
                Clear Filters
              </Button>
            )}
          </div>
          <div className='w-12'></div>{' '}
          {/* Spacer to balance the filter button */}
        </div>

        {/* Active filters display */}
        {hasActiveFilters() && (
          <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Search className='w-4 h-4' />
              <span>Active filters:</span>
              {filters.categoryId && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Category:{' '}
                  {
                    categoriesData?.getCategories?.find(
                      (c: { id: string; name: string }) =>
                        c.id === filters.categoryId
                    )?.name
                  }
                </span>
              )}
              {filters.condition && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Condition: {filters.condition}
                </span>
              )}
              {filters.location && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Location: {filters.location}
                </span>
              )}
              {filters.searchTerm && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Search: &quot;{filters.searchTerm}&quot;
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className='w-full mb-4 text-sm text-muted-foreground'>
          {loading
            ? 'Loading...'
            : `${totalCount} listing${totalCount !== 1 ? 's' : ''} found`}
        </div>

        {/* Listings grid */}
        {loading ? (
          <div className='w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
              {Array.from({ length: limit }).map((_, index) => (
                <SkeletonListingCard key={index} />
              ))}
            </div>
          </div>
        ) : listings.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-lg text-muted-foreground mb-2'>
              No listings found
            </p>
            {hasActiveFilters() && (
              <Button
                variant='outline'
                onClick={clearAllFilters}
                className='mt-2'
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {error && (
          <div className='w-full mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
            <p className='text-destructive'>Error: {error.message}</p>
          </div>
        )}

        {/* Pagination */}
        {totalCount > limit && (
          <div className='flex items-center justify-center gap-4 mt-8'>
            <Button
              onClick={handlePrev}
              disabled={offset === 0}
              size={'icon'}
              variant={'outline'}
              className='rounded-full disabled:opacity-50'
            >
              <ChevronLeft />
            </Button>

            <span className='text-sm text-muted-foreground'>
              {Math.floor(offset / limit) + 1} of{' '}
              {Math.ceil(totalCount / limit)}
            </span>

            <Button
              onClick={handleNext}
              size={'icon'}
              variant={'outline'}
              disabled={offset + limit >= totalCount}
              className='rounded-full disabled:opacity-50'
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
