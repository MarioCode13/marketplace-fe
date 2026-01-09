'use client'
import Image from 'next/image'
import { Condition } from '@/lib/graphql/generated'
import {
  useGetBusinessBySlugQuery,
  useGetMyBusinessQuery,
} from '@/lib/graphql/generated'
import {
  useGetListingsQuery,
  useGetCategoriesQuery,
} from '@/lib/graphql/generated'
import ListingCard from '@/components/cards/ListingCard'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import FilterDrawer, { FilterState } from '@/components/drawers/FilterDrawer'
import {
  ListFilter,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import StoreReviewsModal from '@/components/modals/StoreReviewsModal'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  formatEnum,
  getTextColor,
  buildCategoryTree,
  FlatCategory,
  slugify,
} from '@/lib/utils'
import { Star } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function ProStoreRoute() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.storeSlug as string

  const userContext = useSelector((state: RootState) => state.userContext)
  const currentUserId = userContext.userId
  console.log('Redux user object:', userContext)

  const { data, loading, error } = useGetBusinessBySlugQuery({
    variables: { slug },
    skip: !slug,
  })
  const business = data?.getBusinessBySlug
  const isProStore =
    business?.businessUsers?.[0]?.user?.planType === 'PRO_STORE'
  const branding = business?.storeBranding

  const isStoreUser =
    currentUserId &&
    business?.businessUsers?.some((bu) => {
      const match = bu.user.id.toString() === currentUserId.toString()
      if (match) {
        console.log('User is associated with business:', bu)
      }
      return match
    })
  // Debug logs for user association
  console.log('Current User ID:', currentUserId)
  console.log('Business Users:', business?.businessUsers)
  // Get business data if the current user is the store owner
  // (to show business details like address, contact info)
  const { data: businessData } = useGetMyBusinessQuery()

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
  const [showReviewsModal, setShowReviewsModal] = useState(false)

  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = categoriesData?.getCategories
    ? buildCategoryTree(categoriesData.getCategories as FlatCategory[])
    : []

  type QueryFilters = Filters & { categorySlug?: string }
  const queryFilters: QueryFilters = { ...filters }

  // If a parent category ID is selected, derive the full slug path and send as categorySlug
  if (queryFilters.categoryId && categories && categories.length > 0) {
    const flatCats = (categoriesData?.getCategories || []) as FlatCategory[]
    const idMap = new Map(flatCats.map((c) => [c.id, c]))
    const parts: string[] = []
    if (queryFilters.categoryId) {
      let cur = idMap.get(queryFilters.categoryId)
      const parts: string[] = []

      while (cur) {
        parts.unshift(slugify(cur.name))
        if (!cur.parentId) break
        cur = idMap.get(cur.parentId)
      }

      if (parts.length > 0) {
        queryFilters.categorySlug = parts.join('/')
      }
    }

    if (parts.length > 0) {
      queryFilters.categorySlug = parts.join('/')
      // Keep `categoryId` for queries so parent categories include child results on the backend.
      // Some backend resolvers expect `categoryId` to filter recursively; do not remove it.
    }
  }

  const listingsQueryVars = {
    limit,
    offset,
    ...queryFilters,
    ...(isProStore && business?.id ? { businessId: business.id } : {}),
  }

  // Debug: log final variables being sent to listings query

  const shouldSkipListings = isProStore && !business?.id
  const {
    data: listingsData,
    loading: listingsLoading,
    error: listingsError,
  } = useGetListingsQuery({
    variables: listingsQueryVars,
    skip: shouldSkipListings,
  })
  const allListings = listingsData?.getListings?.listings || []
  // Filter out sold listings
  const listings = allListings.filter((listing) => !listing.sold)
  const totalCount = listings.length

  if (loading) return <div className='p-8 text-center'>Loading store...</div>
  if (error || !business || !isProStore) return notFound()

  // Branding colors
  const backgroundColor = branding?.backgroundColor || '#f8f9fa'
  const primaryColor = branding?.primaryColor || '#fff'
  const cardTextColor = branding?.cardTextColor || '#222'
  const textColor = branding?.textColor || '#222'
  const secondaryColor = branding?.secondaryColor || '#1f1b30'
  const themeColor = branding?.themeColor || '#1f1b30'

  // Business details
  const bannerUrl = branding?.bannerUrl
  const logoUrl = branding?.logoUrl
  // Use the business's real trust rating
  const trustRating = business?.trustRating?.averageRating.toFixed(1)
  const about = branding?.about
  const storeName =
    branding?.storeName ||
    business?.businessUsers?.[0]?.user?.username ||
    business?.name
  const badgeLabel = formatEnum(
    business?.businessUsers?.[0]?.user?.planType ?? ''
  )

  // Filter logic
  const handleApplyFilters = (newFilters: FilterState) => {
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
    <div style={{ background: backgroundColor, color: textColor }}>
      {bannerUrl && (
        <div className='h-72  w-[100vw] max-w-[100%] overflow-hidden mb-6'>
          <Image
            width={2000}
            height={1500}
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
                style={{ color: secondaryColor }}
              >
                {storeName}
              </h1>
              {isStoreUser && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant={'contained'}
                    size={'sm'}
                    color={'gradient'}
                    className='gap-2'
                    onClick={() => router.push('/sell')}
                  >
                    <Plus size={16} />
                    Add Listing
                  </Button>
                  <Button
                    variant={'text'}
                    size={'icon'}
                    color={'gradient'}
                    className='rounded-full'
                    title='Store Settings'
                    onClick={() => router.push('/business/edit')}
                  >
                    <Settings size={20} />
                  </Button>
                </div>
              )}
            </div>
            {about && (
              <p
                className='mt-1'
                style={{ color: textColor }}
              >
                {about}
              </p>
            )}
            <div className='mt-2 flex items-center gap-2'>
              {trustRating !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className='flex items-center gap-1 cursor-pointer'
                        onClick={() => setShowReviewsModal(true)}
                      >
                        {(() => {
                          const rating = Number(trustRating) || 0
                          return [1, 2, 3, 4, 5].map((star) => {
                            if (rating >= star) {
                              return (
                                <Star
                                  key={star}
                                  className='w-4 h-4 text-yellow-400 fill-yellow-400 stroke-yellow-400'
                                />
                              )
                            } else if (rating >= star - 0.75) {
                              return (
                                <span
                                  key={star}
                                  style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    width: '1em',
                                    height: '1em',
                                  }}
                                >
                                  <Star
                                    className='w-4 h-4 text-yellow-400'
                                    style={{
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                    }}
                                  />
                                  <Star
                                    className='w-4 h-4 text-yellow-400 fill-yellow-400 stroke-yellow-400'
                                    style={{
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      clipPath:
                                        'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                                    }}
                                  />
                                </span>
                              )
                            } else {
                              return (
                                <Star
                                  key={star}
                                  className='w-4 h-4 text-gray-300'
                                />
                              )
                            }
                          })
                        })()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                      <p>{trustRating}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {badgeLabel && (
                <span
                  className='text-xs px-2 py-1 rounded ml-2 '
                  style={{
                    backgroundColor: themeColor,
                    color: getTextColor(themeColor),
                  }}
                >
                  {badgeLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <div className='flex items-center justify-start w-full mb-6'>
            <div
              className='flex items-center gap-4'
              style={{ color: textColor }}
            >
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant={'outlined'}
                size={'icon'}
                className='rounded-full p-3'
                style={{ backgroundColor: themeColor }}
              >
                <ListFilter
                  className='!w-5 !h-5'
                  strokeWidth={2}
                  style={{ color: textColor }}
                />
              </Button>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters() && (
            <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
              <div
                className='flex items-center gap-2 text-sm'
                style={{ color: textColor }}
              >
                <Search
                  style={{ color: textColor }}
                  className='w-4 h-4'
                />
                <span style={{ color: textColor }}>Active filters:</span>
                {filters.categoryId && (
                  <span
                    className='bg-background px-2 py-1 rounded text-xs'
                    style={{ color: textColor }}
                  >
                    Category:{' '}
                    {categories.find((c) => c.id === filters.categoryId)?.name}
                  </span>
                )}
                {filters.condition && (
                  <span
                    className='bg-background px-2 py-1 rounded text-xs'
                    style={{ color: textColor }}
                  >
                    Condition: {filters.condition}
                  </span>
                )}
                {filters.searchTerm && (
                  <span
                    className='bg-background px-2 py-1 rounded text-xs'
                    style={{ color: textColor }}
                  >
                    Search: &quot;{filters.searchTerm}&quot;
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span
                    className='bg-background px-2 py-1 rounded text-xs'
                    style={{ color: textColor }}
                  >
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
            className='w-full mb-4 text-sm'
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
                  listing={{
                    ...listing,
                    price: listing.price.toString(),
                    user: listing.user ?? undefined,
                    business: listing.business ?? undefined,
                  }}
                  primaryColor={primaryColor}
                  cardTextColor={cardTextColor}
                  store
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p
                className='text-lg mb-2'
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
                className='text-sm'
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
        {/* Business Details Section */}
        {businessData?.myBusiness && (
          <div
            className='my-14 p-4 rounded-lg border'
            style={{
              borderColor: themeColor + '50',
              backgroundColor: backgroundColor,
              color: textColor,
            }}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              {businessData.myBusiness.email && (
                <div>
                  <span
                    className='font-medium'
                    style={{ color: textColor }}
                  >
                    Email:
                  </span>
                  <span
                    className='ml-2'
                    style={{ color: textColor }}
                  >
                    {businessData.myBusiness.email}
                  </span>
                </div>
              )}
              {businessData.myBusiness.contactNumber && (
                <div>
                  <span
                    className='font-medium'
                    style={{ color: textColor }}
                  >
                    Phone:
                  </span>
                  <span
                    className='ml-2'
                    style={{ color: textColor }}
                  >
                    {businessData.myBusiness.contactNumber}
                  </span>
                </div>
              )}
              {(businessData.myBusiness.addressLine1 ||
                businessData.myBusiness.city) && (
                <div className='md:col-span-2'>
                  <span
                    className='font-medium'
                    style={{ color: textColor }}
                  >
                    Address:
                  </span>
                  <div
                    className='ml-2'
                    style={{ color: textColor }}
                  >
                    {businessData.myBusiness.addressLine1 && (
                      <div>{businessData.myBusiness.addressLine1}</div>
                    )}
                    {businessData.myBusiness.addressLine2 && (
                      <div>{businessData.myBusiness.addressLine2}</div>
                    )}
                    <div>
                      {businessData.myBusiness.city?.name &&
                        `${businessData.myBusiness.city.name}, `}
                      {businessData.myBusiness.city?.region?.name &&
                        `${businessData.myBusiness.city.region.name}, `}
                      {businessData.myBusiness.city?.region?.country?.name}
                      {businessData.myBusiness.postalCode &&
                        ` ${businessData.myBusiness.postalCode}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <StoreReviewsModal
        isOpen={Boolean(showReviewsModal)}
        onClose={() => setShowReviewsModal(false)}
        userId={business?.businessUsers?.[0]?.user?.id || ''}
        title={storeName}
      />
    </div>
  )
}
