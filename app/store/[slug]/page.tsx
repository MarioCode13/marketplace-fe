'use client'

import { useQuery } from '@apollo/client'
import { GET_STORE_BY_SLUG } from '@/lib/graphql/queries/getStoreBySlug'
import { useParams } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import Image from 'next/image'
import { Listing } from '@/lib/graphql/types/trust'

export default function StorePage() {
  const params = useParams()
  const slug = params?.slug as string

  const { data, loading, error } = useQuery(GET_STORE_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  })

  if (loading) return <div className='p-8 text-center'>Loading store...</div>
  if (error)
    return (
      <div className='p-8 text-center text-red-500'>Error loading store.</div>
    )
  if (!data?.storeBySlug)
    return <div className='p-8 text-center'>Store not found.</div>

  const store = data.storeBySlug
  const branding = store.storeBranding
  const listings = store.listings || []

  // Determine plan type and theme color
  const planType = store.planType
  const themeColor =
    branding?.themeColor && planType === 'PRO_STORE'
      ? branding.themeColor
      : '#2563eb' // default blue
  const showBanner = planType === 'PRO_STORE' && branding?.bannerUrl
  const badgeLabel =
    planType === 'PRO_STORE'
      ? 'Pro Store'
      : planType === 'RESELLER'
      ? 'Reseller'
      : null

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {/* Banner (Pro Store only) */}
      {showBanner && (
        <div className='w-full h-48 rounded-lg overflow-hidden mb-4'>
          <Image
            width={1200}
            height={1200}
            src={branding.bannerUrl}
            alt='Store banner'
            className='w-full h-full object-cover'
          />
        </div>
      )}
      {/* Logo and About */}
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
        <div>
          <h1
            className='text-2xl font-bold'
            style={{ color: themeColor }}
          >
            {branding?.storeName || store.username}
          </h1>
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
      {/* Listings */}
      <h2 className='text-xl font-semibold mt-8 mb-4'>Listings</h2>
      {listings.length === 0 ? (
        <div className='text-gray-500'>No active listings.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {listings.map((listing: Listing) => (
            <ListingCard
              key={listing.id}
              listing={{ ...listing, price: listing.price.toString() }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
