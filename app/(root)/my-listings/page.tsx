'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MY_LISTINGS } from '@/lib/graphql/queries/myListings'
import ListingCard from '@/components/cards/ListingCard'

interface Listing {
  id: string
  title: string
  description: string
  price: string
  images: string[]
  createdAt: string
  sold?: boolean
  user?: {
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

export default function MyListingsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const [limit] = useState(3)
  const [offset, setOffset] = useState(0)

  const { loading, error, data } = useQuery(MY_LISTINGS, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network',
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const listings: Listing[] = data?.myListings?.listings || []
  const totalCount: number = data?.myListings?.totalCount || listings.length

  const handleNext = () => {
    if (offset + limit < totalCount) setOffset(offset + limit)
  }

  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='flex flex-col py-12 px-6 w-full max-w-7xl'>
        {token ? (
          <>
            {/* Header with title and button */}
            <div className='flex items-center justify-between w-full mb-6'>
              <div className='w-12'></div> {/* Spacer to balance the button */}
              <div className='flex items-center gap-4'>
                <h1 className='text-2xl font-bold'>My Listings</h1>
              </div>
              <div className='flex items-center gap-4'>
                <Link href='/sell'>
                  <Button>Sell New Item</Button>
                </Link>
              </div>
            </div>
            {loading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonListingCard key={index} />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    showMenu
                    onEdit={() => router.push(`/edit-listing/${listing.id}`)}
                    onDelete={() => console.log('Delete clicked')}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-600 mb-4'>
                  You don&apos;t have any active listings.
                </p>
              </div>
            )}
            {error && <p className='text-red-500'>Error: {error.message}</p>}

            {listings.length > 0 && (
              <div className='flex items-center gap-4 mt-14 justify-center'>
                <Button
                  onClick={handlePrev}
                  disabled={offset === 0}
                  size={'icon'}
                  variant={'outline'}
                  className='rounded-full disabled:opacity-50'
                >
                  <ChevronLeft />
                </Button>

                <div className='text-sm text-gray-600'>
                  {Math.floor(offset / limit) + 1} of{' '}
                  {Math.ceil(totalCount / limit)}
                  <span className='ml-2 text-gray-400'></span>
                </div>

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
          </>
        ) : (
          <div>
            <h1 className='text-2xl font-bold'>Please Log In</h1>
            <p>You need to be logged in to view listings.</p>
            <Link
              href='/login'
              className='text-blue-500 underline'
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
