'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MY_LISTINGS } from '@/lib/graphql/queries/myListings'

interface Listing {
  id: string
  title: string
  description: string
  price: string
  images: string[]
  createdAt: string
}

export default function MyListingsPage() {
  const token = useSelector((state: RootState) => state.auth.token)
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

  // Use the query result to calculate listings and total count
  const listings: Listing[] = data?.myListings || []
  const totalCount: number = data?.totalCount || listings.length // Assuming totalCount is returned from the query

  const handleNext = () => {
    if (offset + limit < totalCount) setOffset(offset + limit)
  }

  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit)
  }

  return (
    <div className='relative'>
      <div className='flex'>
        <div className='flex flex-col items-center p-6 w-full'>
          {token ? (
            <>
              <h1 className='text-2xl font-bold mb-12'>My Listings</h1>
              <Link href='/sell'>
                <Button className='absolute top-6 right-6    '>
                  Sell New Item
                </Button>
              </Link>
              {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonListingCard key={index} />
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                  {listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      passHref
                    >
                      <div className='border p-4 rounded-lg shadow-lg min-h-[300px]'>
                        <Image
                          src={listing.images[0] || '/placeholder.png'}
                          alt={listing.title}
                          width={100}
                          height={100}
                          className='w-full h-40 object-cover rounded-md'
                        />
                        <h2 className='text-xl font-semibold mt-2'>
                          {listing.title}
                        </h2>
                        <p className='text-gray-600 line-clamp-2 min-h-[48px]'>
                          {listing.description}
                        </p>
                        <p className='text-green-600 font-bold'>
                          ${listing.price}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {dayjs(listing.createdAt).format('DD-MM-YYYY')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>No listings found.</p>
              )}
              {error && <p className='text-red-500'>Error: {error.message}</p>}

              {/* Pagination Controls */}
              <div className='flex gap-4 mt-14'>
                <Button
                  onClick={handlePrev}
                  disabled={offset === 0}
                  size={'icon'}
                  variant={'outline'}
                  className='rounded-full disabled:opacity-50'
                >
                  <ChevronLeft />
                </Button>
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
    </div>
  )
}
