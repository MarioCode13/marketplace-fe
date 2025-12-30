import React from 'react'
import Image from 'next/image'
import ListingCard, { CardListing } from '@/components/cards/ListingCard'
import { X } from 'lucide-react'
import { Button } from '../ui/button'

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
  // Use new color fields for preview
  const backgroundColor = form.backgroundColor || '#f8f9fa'
  const primaryColor = form.primaryColor || '#fff'
  const cardTextColor = form.cardTextColor || '#222'
  const textColor = form.textColor || '#222'
  // const secondaryColor = form.secondaryColor || '#1f1b30'
  const themeColor = form.themeColor || '#1f1b30'
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div
        className='rounded-lg shadow-lg p-6 max-w-3xl w-full relative'
        style={{ background: backgroundColor }}
      >
        <Button
          variant='contained'
          size={'icon'}
          color={'gradient'}
          className='rounded-full absolute top-2 right-2 text-gray-500 hover:text-gray-800'
          onClick={() => setShowPreview(false)}
          style={{ color: textColor }}
        >
          <X size={26} />
        </Button>
        {/* Banner */}
        {form.bannerUrl && (
          <div className='w-full h-40 rounded-lg overflow-hidden mb-4'>
            <Image
              width={1200}
              height={200}
              src={form.bannerUrl}
              alt='Store banner'
              className='w-full h-full object-cover'
            />
          </div>
        )}
        {/* Logo and About */}
        <div className='flex items-center gap-4 mb-4'>
          {form.logoUrl && (
            <Image
              width={80}
              height={80}
              src={form.logoUrl}
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
            <h1
              className='text-2xl font-bold'
              style={{ color: primaryColor }}
            >
              {form.storeName || 'Store Name'}
            </h1>
            {form.about && (
              <p
                className='text-gray-600 mt-1'
                style={{ color: textColor }}
              >
                {form.about}
              </p>
            )}
            <div className='mt-2 flex items-center gap-2'>
              <span
                className='text-xs px-2 py-1 rounded text-white border'
                style={{ backgroundColor: themeColor }}
              >
                Preview Theme
              </span>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
  )
}
