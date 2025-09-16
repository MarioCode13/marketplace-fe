'use client'

import {
  useGetListingsQuery,
  useGetBusinessByIdQuery,
} from '@/lib/graphql/generated'
import { useParams, useRouter } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import Image from 'next/image'
import { Settings, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { getTextColor } from '@/lib/utils'

export default function StorePage() {
  const params = useParams()
  const navigate = useRouter()
  const businessId = params?.businessId as string // This will be the business ID, not a slug
  const currentUserId = useSelector(
    (state: RootState) => state.auth.user?.userId
  )

  console.log('Store page loaded with businessId:', businessId)

  // State for pagination only (no filters for resellers)
  const [offset, setOffset] = useState(0)
  const limit = 8

  // Get business data for this business store
  const {
    data: businessData,
    loading: businessLoading,
    error: businessError,
  } = useGetBusinessByIdQuery({
    variables: { id: businessId },
    skip: !businessId,
  })

  // Debug logging
  console.log('Business query result:', {
    businessData,
    businessLoading,
    businessError,
  })
  console.log('Current user ID:', currentUserId, typeof currentUserId)
  console.log('Business ID from URL:', businessId)

  const {
    data: listingsData,
    loading: listingsLoading,
    error: listingsError,
  } = useGetListingsQuery({
    variables: {
      limit,
      offset,
      // TODO: For business stores, we might want to show listings from all business users
      // For now, let's just skip the listings query
    },
    skip: true, // Skip for now until we determine the correct approach
  })

  if (businessLoading)
    return <div className='p-8 text-center'>Loading store...</div>
  if (businessError)
    return (
      <div className='p-8 text-center text-red-500'>Error loading store.</div>
    )
  if (!businessData?.business)
    return <div className='p-8 text-center'>Store not found.</div>

  const business = businessData.business
  const branding = business.storeBranding
  const listings = listingsData?.getListings?.listings || []
  const totalCount = listingsData?.getListings?.totalCount || 0

  // Additional debug logging after business is available
  console.log(
    'Business users details:',
    business.businessUsers?.map((bu) => ({
      userId: bu.user.id,
      userIdType: typeof bu.user.id,
      username: bu.user.username,
      role: bu.role,
    }))
  )

  // For business stores, we show "Business Store" instead of plan type
  const themeColor = branding?.themeColor || '#1f1b30'
  const primaryColor = branding?.primaryColor || '#1f1b30'
  const badgeLabel = 'Business Store'

  // Check ownership/management permissions
  // For business stores: current user must be a member of the business with OWNER or ADMIN role
  const isBusinessMember = business.businessUsers?.some(
    (businessUser) =>
      businessUser.user.id.toString() === currentUserId?.toString() &&
      ['OWNER', 'ADMIN'].includes(businessUser.role as string)
  )
  const isOwner = isBusinessMember

  // Debug ownership logic
  console.log('Business ownership check:', {
    isBusinessMember,
    isOwner,
    currentUserId,
    businessId: business.id,
    businessUsers: business.businessUsers,
  })

  const bgColor = branding?.lightOrDark === 'light' ? '#dde2e8' : '#121212'
  const textColor = getTextColor(bgColor)

  const handleNext = () => {
    if (offset + limit < totalCount) setOffset(offset + limit)
  }

  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  return (
    <div style={{ background: bgColor }}>
      <div className='max-w-5xl mx-auto p-4 pb-12'>
        {/* Store Header */}
        <div className='flex items-center gap-4 mb-4 pt-4'>
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
                {branding?.storeName || business.name}
              </h1>
              {isOwner && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant={'text'}
                    size={'sm'}
                    className='gap-2'
                    onClick={() => navigate.push('/sell')}
                  >
                    <Plus size={16} />
                    Add Listing
                  </Button>
                  <Button
                    variant={'text'}
                    size={'icon'}
                    className='rounded-full'
                    title='Store Settings'
                    onClick={() => navigate.push('/business/edit')}
                  >
                    <Settings
                      size={24}
                      style={{
                        color: textColor,
                      }}
                    />
                  </Button>
                </div>
              )}
            </div>
            {branding?.about && (
              <p className='text-gray-600 mt-1'>{branding.about}</p>
            )}
            <div className='mt-2 flex items-center gap-2'>
              {/* Business stores don't have individual trust ratings */}
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
                  listing={{
                    ...listing,
                    price: listing.price.toString(),
                    user: listing.user === null ? undefined : listing.user,
                    business: business ? { name: business.name } : undefined,
                  }}
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
