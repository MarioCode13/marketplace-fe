import React from 'react'
import Image from 'next/image'
import ListingCard, { CardListing } from '@/components/cards/ListingCard'
import { X, ListFilter } from 'lucide-react'
import { Button } from '../ui/button'
import { getTextColor } from '@/lib/utils'

interface PreviewModalProps {
  form: {
    storeName: string
    about: string
    themeColor: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    cardTextColor: string
    lightOrDark: string
    logoUrl: string
    bannerUrl: string
  }
  setShowPreview: (show: boolean) => void
}

const dummyListings: CardListing[] = [
  {
    id: '1',
    title: 'Sample Listing 1',
    description: 'A great product for preview purposes.',
    price: '99.99',
    images: ['/logo.png'],
    createdAt: new Date().toISOString(),
    user: {
      id: 'dummy',
      username: 'DemoSeller',
      trustRating: {
        overallScore: 90,
        starRating: 4.8,
        trustLevel: 'Trusted',
        totalReviews: 12,
        positiveReviews: 11,
        verifiedId: true,
      },
    },
  },
  {
    id: '2',
    title: 'Sample Listing 2',
    description: 'Another example listing to show the preview.',
    price: '49.50',
    images: ['/logo.png'],
    createdAt: new Date().toISOString(),
    user: {
      id: 'dummy',
      username: 'DemoSeller',
      trustRating: {
        overallScore: 90,
        starRating: 4.8,
        trustLevel: 'Trusted',
        totalReviews: 12,
        positiveReviews: 11,
        verifiedId: true,
      },
    },
  },
]

export default function PreviewModal({
  form,
  setShowPreview,
}: PreviewModalProps) {
  // Match store page ([storeSlug]/page.tsx) color usage exactly
  const backgroundColor = form.backgroundColor || '#f8f9fa'
  const primaryColor = form.primaryColor || '#fff'
  const cardTextColor = form.cardTextColor || '#222'
  const textColor = form.textColor || '#222'
  const secondaryColor = form.secondaryColor || '#1f1b30'
  const themeColor = form.themeColor || '#1f1b30'
  const bannerUrl = form.bannerUrl
  const logoUrl = form.logoUrl
  const about = form.about
  const storeName = form.storeName || 'Store Name'

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto'>
      <div
        className='relative w-full max-w-5xl rounded-lg shadow-xl overflow-hidden my-8'
        style={{ background: backgroundColor, color: textColor }}
      >
        <Button
          variant='contained'
          size='icon'
          color='gradient'
          className='rounded-full absolute top-4 right-4 z-10'
          onClick={() => setShowPreview(false)}
        >
          <X size={20} />
        </Button>

        {/* Banner - same as store page: h-72, full width, mb-6 */}
        {bannerUrl && (
          <div className='h-72 w-full overflow-hidden mb-6'>
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
          {/* Store header - same structure as [storeSlug]/page.tsx */}
          <div className='flex items-center gap-4 mb-4'>
            {logoUrl && (
              <Image
                width={80}
                height={80}
                src={logoUrl}
                alt='Store logo'
                className='w-20 h-20 rounded-full object-cover border shrink-0'
                style={{
                  borderColor: themeColor,
                  borderWidth: 2,
                  borderStyle: 'solid',
                }}
              />
            )}
            <div className='flex-1 min-w-0'>
              <h1
                className='text-2xl font-bold'
                style={{ color: secondaryColor }}
              >
                {storeName}
              </h1>
              {about && (
                <p className='mt-1' style={{ color: textColor }}>
                  {about}
                </p>
              )}
              <div className='mt-2 flex items-center gap-2'>
                <span
                  className='text-xs px-2 py-1 rounded'
                  style={{
                    backgroundColor: themeColor,
                    color: getTextColor(themeColor),
                  }}
                >
                  Preview
                </span>
              </div>
            </div>
          </div>

          {/* Filter area - same as store page */}
          <div className='mt-8'>
            <div className='flex items-center justify-start w-full mb-6'>
              <div className='flex items-center gap-4' style={{ color: textColor }}>
                <Button
                  variant='outlined'
                  size='icon'
                  className='rounded-full p-3 pointer-events-none opacity-80'
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

            {/* Results count - same as store page */}
            <div className='w-full mb-4 text-sm' style={{ color: textColor }}>
              {dummyListings.length} listing{dummyListings.length !== 1 ? 's' : ''}{' '}
              found
            </div>

            {/* Listings grid - same as store page: 4 columns on xl */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
              {dummyListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  primaryColor={primaryColor}
                  cardTextColor={cardTextColor}
                  store
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
