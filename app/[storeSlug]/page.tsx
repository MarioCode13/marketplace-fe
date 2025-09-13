'use client'
import Image from 'next/image'
import { Condition } from '@/lib/graphql/generated'
import { useGetStoreBySlugFullQuery } from '@/lib/graphql/generated'
import {
  useGetListingsQuery,
  useGetCategoriesQuery,
} from '@/lib/graphql/generated'
import ListingCard from '@/components/cards/ListingCard'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import FilterDrawer from '@/components/drawers/FilterDrawer'
import { ListFilter, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getTextColor } from '@/lib/utils'

export default function ProStoreRoute() {
  const params = useParams()
  const slug = params?.storeSlug as string

  // Store data
  const { data, loading, error } = useGetStoreBySlugFullQuery({
    variables: { slug },
    skip: !slug,
  })
  const store = data?.storeBySlug
  const isProStore = store?.planType === 'PRO_STORE'
  const branding = store?.storeBranding

  // Filters and listings
  interface Filters {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    condition?: Condition
    cityId?: string
    customCity?: string
    searchTerm?: string
    minDate?: string
    maxDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})
  const [offset, setOffset] = useState(0)
  const limit = 8

  // Categories for filter
  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = (categoriesData?.getCategories || []).filter(
    (c): c is { id: string; name: string } =>
      !!c && typeof c.id === 'string' && typeof c.name === 'string'
  )

  // Listings for this store
  const {
    data: listingsData,
    loading: listingsLoading,
    error: listingsError,
  } = useGetListingsQuery({
    variables: {
      limit,
      offset,
      userId: store?.id,
      ...filters,
    },
    skip: !store?.id,
  })
  const listings = listingsData?.getListings?.listings || []
  const totalCount = listingsData?.getListings?.totalCount || 0

  if (loading) return <div className='p-8 text-center'>Loading store...</div>
  if (error || !store || !isProStore) return notFound()

  // Theme colors
  const themeColor = branding?.themeColor || '#1f1b30'
  const primaryColor = branding?.primaryColor || '#1f1b30'
  const bgColor = branding?.lightOrDark === 'light' ? '#dde2e8' : '#121212'
  const textColor = getTextColor(bgColor)

  // Store details
  const bannerUrl = branding?.bannerUrl
  const logoUrl = branding?.logoUrl
  const trustRating = store?.trustRating?.starRating?.toFixed(1)
  const trustLevel = store?.trustRating?.trustLevel
  const about = branding?.about
  const storeName = branding?.storeName || store.username
  const badgeLabel = 'Pro Store'

  // Filter logic
  const handleApplyFilters = (newFilters: Record<string, unknown>) => {
    const convertedFilters: Filters = {
      ...newFilters,
      condition: newFilters.condition as Condition | undefined,
    }
    setFilters(convertedFilters)
    setOffset(0)
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
  const handleNext = () => {
    if (offset + limit < totalCount) setOffset(offset + limit)
  }
  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  return (
    <div style={{ background: bgColor }}>
      {bannerUrl && (
        <div className='h-64 w-[100vw]  overflow-hidden mb-6'>
          <Image
            width={1200}
            height={1200}
            src={bannerUrl}
            alt='Store banner'
            className='w-full h-full object-cover'
          />
        </div>
      )}
      <div className='max-w-5xl mx-auto p-4'>
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
          categories={categories}
          currentFilters={filters}
        />

        {/* Store Header */}
        <div className='flex items-center gap-4 mb-4'>
          {logoUrl && (
            <Image
              width={80}
              height={80}
              src={logoUrl}
              alt='Store logo'
              className='w-20 h-20 rounded-full object-cover border'
              style={{
                borderColor: themeColor,
                borderWidth: 2,
                borderStyle: 'solid',
              }}
            />
          )}
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <h1
                className='text-2xl font-bold'
                style={{ color: primaryColor }}
              >
                {storeName}
              </h1>
            </div>
            {about && <p className='text-gray-600 mt-1'>{about}</p>}
            <div className='mt-2 flex items-center gap-2'>
              {trustRating && (
                <span className='text-yellow-500 font-semibold'>
                  ★ {trustRating}
                </span>
              )}
              {trustLevel && (
                <span className='text-xs bg-gray-100 px-2 py-1 rounded text-black'>
                  {trustLevel}
                </span>
              )}
              {badgeLabel && (
                <span
                  className='text-xs px-2 py-1 rounded ml-2 text-white'
                  style={{ backgroundColor: themeColor }}
                >
                  {badgeLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-start w-full mb-6'>
            <div className='flex items-center gap-4'>
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant={'outlined'}
                size={'icon'}
                className='rounded-full p-3'
              >
                <ListFilter
                  className='!w-5 !h-5'
                  strokeWidth={2}
                />
              </Button>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters() && (
            <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Search
                  style={{ color: textColor }}
                  className='w-4 h-4'
                />
                <span style={{ color: textColor }}>Active filters:</span>
                {filters.categoryId && (
                  <span className='bg-background px-2 py-1 rounded text-xs'>
                    Category:{' '}
                    {categories.find((c) => c.id === filters.categoryId)?.name}
                  </span>
                )}
                {filters.condition && (
                  <span className='bg-background px-2 py-1 rounded text-xs'>
                    Condition: {filters.condition}
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
              {hasActiveFilters() && (
                <Button
                  color='secondary'
                  size='sm'
                  onClick={clearAllFilters}
                  className='text-sm mt-4'
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Results count */}
          <div
            className='w-full mb-4 text-sm text-muted-foreground'
            style={{ color: textColor }}
          >
            {listingsLoading
              ? 'Loading...'
              : `${totalCount} listing${totalCount !== 1 ? 's' : ''} found`}
          </div>

          {/* Listings grid */}
          {listingsLoading ? (
            <div className='w-full'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
                {Array.from({ length: limit }).map((_, index) => (
                  <SkeletonListingCard key={index} />
                ))}
              </div>
            </div>
          ) : listings.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={{ ...listing, price: listing.price.toString() }}
                  themeColor={themeColor}
                  primaryColor={primaryColor}
                  store
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p
                className='text-lg text-muted-foreground mb-2'
                style={{ color: textColor }}
              >
                No listings found
              </p>
              {hasActiveFilters() && (
                <Button
                  color='secondary'
                  onClick={clearAllFilters}
                  className='mt-2 '
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {listingsError && (
            <div className='w-full mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
              <p className='text-destructive'>Error: {listingsError.message}</p>
            </div>
          )}

          {/* Pagination */}
          {totalCount > limit && (
            <div className='flex items-center justify-center gap-4 mt-8'>
              <Button
                onClick={handlePrev}
                disabled={offset === 0}
                size={'icon'}
                variant={'outlined'}
                className='rounded-full disabled:opacity-50'
              >
                <ChevronLeft />
              </Button>

              <span
                className='text-sm text-muted-foreground'
                style={{ color: textColor }}
              >
                {Math.floor(offset / limit) + 1} of{' '}
                {Math.ceil(totalCount / limit)}
              </span>

              <Button
                onClick={handleNext}
                size={'icon'}
                variant={'outlined'}
                disabled={offset + limit >= totalCount}
                className='rounded-full disabled:opacity-50'
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
