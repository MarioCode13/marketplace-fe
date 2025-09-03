'use client'

import {
  useGetListingsQuery,
  useGetCategoriesQuery,
  useGetStoreBySlugFullQuery,
  Condition,
  Category,
} from '@/lib/graphql/generated'
import { useParams, useRouter } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import FilterDrawer from '@/components/drawers/FilterDrawer'
import Image from 'next/image'
import {
  Settings,
  ListFilter,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { getTextColor } from '@/lib/utils'

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

function isCategory(c: unknown): c is Category {
  return (
    typeof c === 'object' &&
    c !== null &&
    'id' in c &&
    typeof (c as Category).id === 'string' &&
    'name' in c &&
    typeof (c as Category).name === 'string'
  )
}

export default function StorePage() {
  const params = useParams()
  const navigate = useRouter()
  const slug = params?.slug as string
  const currentUserId = useSelector(
    (state: RootState) => state.auth.user?.userId
  )

  // State for filtering and pagination
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})
  const [offset, setOffset] = useState(0)
  const limit = 4

  const {
    data: storeData,
    loading: storeLoading,
    error: storeError,
  } = useGetStoreBySlugFullQuery({
    variables: { slug },
    skip: !slug,
  })

  const { data: categoriesData } = useGetCategoriesQuery()

  const categories: Category[] = (categoriesData?.getCategories || []).filter(
    isCategory
  )

  const {
    data: listingsData,
    loading: listingsLoading,
    error: listingsError,
  } = useGetListingsQuery({
    variables: {
      limit,
      offset,
      userId: storeData?.storeBySlug?.id,
      ...filters,
    },
    skip: !storeData?.storeBySlug?.id,
  })

  if (storeLoading)
    return <div className='p-8 text-center'>Loading store...</div>
  if (storeError)
    return (
      <div className='p-8 text-center text-red-500'>Error loading store.</div>
    )
  if (!storeData?.storeBySlug)
    return <div className='p-8 text-center'>Store not found.</div>

  const store = storeData.storeBySlug
  const branding = store.storeBranding
  const listings = listingsData?.getListings?.listings || []
  const totalCount = listingsData?.getListings?.totalCount || 0

  const planType = store.planType
  const themeColor =
    branding?.themeColor && planType === 'PRO_STORE'
      ? branding.themeColor
      : '#1f1b30'
  const primaryColor = branding?.primaryColor
    ? branding.primaryColor
    : '#1f1b30'
  const showBanner = planType === 'PRO_STORE' && branding?.bannerUrl
  const badgeLabel =
    planType === 'PRO_STORE'
      ? 'Pro Store'
      : planType === 'RESELLER'
      ? 'Reseller'
      : null

  const isOwner = currentUserId && store.id == currentUserId
  const bgColor = branding?.lightOrDark === 'light' ? '#dde2e8' : '#121212'
  const textColor = getTextColor(bgColor)

  const handleNext = () => {
    if (offset + limit < totalCount) setOffset(offset + limit)
  }

  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  const handleApplyFilters = (newFilters: {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    condition?: string
    cityId?: string
    customCity?: string
    searchTerm?: string
    minDate?: string
    maxDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    setFilters({
      ...newFilters,
      condition: newFilters.condition
        ? (newFilters.condition as Condition)
        : undefined,
    })
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

  return (
    <div style={{ background: bgColor }}>
      <div className='max-w-5xl mx-auto p-4'>
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
          categories={categories}
          currentFilters={filters}
        />

        {showBanner && (
          <div className='w-full h-48 rounded-lg overflow-hidden mb-4'>
            <Image
              width={1200}
              height={1200}
              src={branding.bannerUrl ?? ''}
              alt='Store banner'
              className='w-full h-full object-cover'
            />
          </div>
        )}

        {/* Store Header */}
        <div className='flex items-center gap-4 mb-4'>
          {branding?.logoUrl && (
            <Image
              width={80}
              height={80}
              src={branding.logoUrl}
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
                style={{ color: branding?.primaryColor ?? 'unset' }}
              >
                {branding?.storeName || store.username}
              </h1>
              {isOwner && (
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className='rounded-full '
                  title='Store Settings'
                  onClick={() => navigate.push('/store/edit')}
                >
                  <Settings
                    size={24}
                    style={{
                      color: textColor,
                    }}
                  />
                </Button>
              )}
            </div>
            {branding?.about && (
              <p className='text-gray-600 mt-1'>{branding.about}</p>
            )}
            <div className='mt-2 flex items-center gap-2'>
              {store.trustRating && (
                <span className='text-yellow-500 font-semibold'>
                  ★ {store.trustRating.starRating?.toFixed(1) || '-'}
                </span>
              )}
              {store.trustRating?.trustLevel && (
                <span className='text-xs bg-gray-100 px-2 py-1 rounded text-black'>
                  {store.trustRating.trustLevel}
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
                  btnColor='secondary'
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
                  btnColor='secondary'
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
                variant={'outline'}
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
    </div>
  )
}
