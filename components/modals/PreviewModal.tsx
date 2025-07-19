import React from 'react'
import Image from 'next/image'
import ListingCard from '@/components/cards/ListingCard'
import { X } from 'lucide-react'
import { getTextColor } from '@/lib/utils'

interface PreviewModalProps {
  form: {
    storeName: string
    about: string
    themeColor: string
    primaryColor: string
    secondaryColor: string
    lightOrDark: string
    logoUrl: string
    bannerUrl: string
    slug: string
  }
  setShowPreview: (show: boolean) => void
}

const dummyListings = [
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
      },
      storeBranding: { slug: 'demo-store' },
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
      },
      storeBranding: { slug: 'demo-store' },
    },
  },
]

export default function PreviewModal({
  form,
  setShowPreview,
}: PreviewModalProps) {
  const bgColor = form.lightOrDark === 'dark' ? '#121212' : '#dde2e8'
  const textColor = getTextColor(form.themeColor)
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div
        className='rounded-lg shadow-lg p-6 max-w-3xl w-full relative'
        style={{ background: bgColor }}
      >
        <button
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-800'
          onClick={() => setShowPreview(false)}
          style={{ color: textColor }}
        >
          <X size={26} />
        </button>
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
                borderColor: form.themeColor,
                borderWidth: 2,
                borderStyle: 'solid',
              }}
            />
          )}
          <div className='flex-1'>
            <h1
              className='text-2xl font-bold'
              style={{ color: form.themeColor }}
            >
              {form.storeName || 'Store Name'}
            </h1>
            {form.about && <p className='text-gray-600 mt-1'>{form.about}</p>}
            <div className='mt-2 flex items-center gap-2'>
              <span className='text-xs px-2 py-1 rounded text-black border'>
                {form.lightOrDark === 'dark' ? 'Dark Theme' : 'Light Theme'}
              </span>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {dummyListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              themeColor={form.themeColor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
