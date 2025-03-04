'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'

const GET_ALL_LISTINGS = gql`
  query GetAllListings {
    getAllListings {
      id
      title
      description
      price
      images
      createdAt
    }
  }
`

interface Listing {
  id: string
  title: string
  description: string
  price: string
  images: string
  createdAt: string
}

export default function BuyPage() {
  const token = useSelector((state: RootState) => state.auth.token)
  const { loading, error, data } = useQuery(GET_ALL_LISTINGS)

  return (
    <div className='flex flex-col items-center p-6'>
      {token ? (
        <>
          <h1 className='text-2xl font-bold mb-4'>Available Listings</h1>
          {loading && <p>Loading listings...</p>}
          {error && <p className='text-red-500'>Error: {error.message}</p>}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {data?.getAllListings?.map((listing: Listing) => (
              <div
                key={listing.id}
                className='border p-4 rounded-lg shadow-lg'
              >
                <Image
                  src={
                    `data:image/png;base64,${listing.images[0]}` ||
                    '/placeholder.png'
                  }
                  alt={listing.title}
                  width={10}
                  height={20}
                  className='w-full h-40 object-cover rounded-md'
                />
                <h2 className='text-xl font-semibold mt-2'>{listing.title}</h2>
                <p className='text-gray-600'>{listing.description}</p>
                <p className='text-green-600 font-bold'>${listing.price}</p>
                <p className='text-sm text-gray-500'>
                  {dayjs(listing.createdAt).format('DD-MM-YYYY')}
                </p>
              </div>
            ))}
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
  )
}
