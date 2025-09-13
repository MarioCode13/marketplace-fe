'use client'

import {
  useGetListingsQuery,
  useGetUserByIdQuery,
} from '@/lib/graphql/generated'
import { useParams, useRouter } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import Image from 'next/image'
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react'
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

  // Debug logging
  console.log('Store page loaded with businessId:', businessId)

  // State for pagination only (no filters for resellers)
  const [offset, setOffset] = useState(0)
  const limit = 8

  const {
    data: storeData,
    loading: storeLoading,
    error: storeError,
  } = useGetUserByIdQuery({
    variables: { id: businessId },
    skip: !businessId,
  })

  // Debug logging
  console.log('Store query result:', { storeData, storeLoading, storeError })

  const {
    data: listingsData,
    loading: listingsLoading,
    error: listingsError,
  } = useGetListingsQuery({
    variables: {
      limit,
      offset,
      userId: storeData?.getUserById?.id,
    },
    skip: !storeData?.getUserById?.id,
  })

  if (storeLoading)
    return <div className='p-8 text-center'>Loading store...</div>
  if (storeError)
    return (
      <div className='p-8 text-center text-red-500'>Error loading store.</div>
    )
  if (!storeData?.getUserById)
    return <div className='p-8 text-center'>Store not found.</div>

  const store = storeData.getUserById
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
                {branding?.storeName || store.username}
              </h1>
              {isOwner && (
                <Button
                  variant={'text'}
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
