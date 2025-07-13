'use client'

import { GET_LISTING_BY_ID } from '@/lib/graphql/queries'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import ContactSellerModal from '@/components/modals/ContactSellerModal'
import { Button } from '@/components/ui/button'
import { User, Shield, Star } from 'lucide-react'

const Page = () => {
  const params = useParams()
  const id = params?.id as string
  const [modalOpen, setModalOpen] = useState(false)

  const { data, loading, error } = useQuery(GET_LISTING_BY_ID, {
    variables: { id },
    skip: !id,
  })

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <Skeleton className='h-10 w-3/4 mb-4' />
        <Skeleton className='h-6 w-1/3 mb-6' />
        <Skeleton className='h-80 w-full rounded-lg' />
      </div>
    )
  }

  if (error)
    return (
      <p className='text-red-500 text-center mt-6'>Error: {error.message}</p>
    )
  if (!data?.getListingById)
    return <p className='text-center mt-6'>Listing not found.</p>

  const listing = data.getListingById

  return (
    <div className='max-w-5xl mx-auto p-6'>
      {/* Image Gallery & Details */}
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='md:w-1/2'>
          <Image
            src={listing.images[0] || '/placeholder.png'}
            alt={listing.title}
            width={600}
            height={400}
            className='rounded-lg shadow-lg w-full object-cover max-h-[460px]'
          />
          <div className='flex gap-2 mt-4 overflow-x-auto'>
            {listing.images.map((image: string, index: number) => (
              <Image
                key={index}
                src={image}
                alt={`Preview ${index}`}
                width={80}
                height={80}
                className='rounded-md cursor-pointer border border-gray-300 hover:border-black'
              />
            ))}
          </div>
        </div>

        {/* Listing Details + Seller Info */}
        <div className='md:w-1/2 space-y-6 flex flex-col justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>{listing.title}</h1>
            <p className='text-gray-600'>{listing.description}</p>
            <p className='text-2xl font-semibold text-green-600'>
              ${listing.price}
            </p>
            <p className='text-sm text-gray-500'>
              Location: {listing.location}
            </p>
            <Badge className='w-fit'>{listing.condition}</Badge>
          </div>

          {/* Seller Info - Now Below the Details */}
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-4 mb-3'>
                {listing.user.profileImageUrl === null ? (
                  <User className='w-6 h-6' />
                ) : (
                  <Image
                    src={`data:image/png;base64,${listing.user.profileImageUrl}`}
                    height={50}
                    width={50}
                    alt='profile'
                    className='rounded-full w-12 h-12 object-cover'
                  />
                )}

                <div className='flex-1'>
                  <p className='text-gray-500 text-sm'>Seller</p>
                  <h2 className='text-lg font-semibold'>
                    {listing.user.username}
                  </h2>
                </div>
                <Button
                  onClick={() => setModalOpen(true)}
                  variant='secondary'
                >
                  Contact Seller
                </Button>
              </div>

              {/* Trust Rating Display */}
              <div className='border-t pt-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <Shield className='w-4 h-4 text-blue-600' />
                  <span className='text-sm font-medium'>Trust Rating</span>
                </div>
                {/* This would be populated with actual trust data */}
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className='text-sm text-gray-600 ml-1'>4.0</span>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-green-100 text-green-800 border-green-200'
                  >
                    <Shield className='w-3 h-3 mr-1' />
                    VERY GOOD
                  </Badge>
                  <span className='text-sm text-gray-600'>(12 reviews)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactSellerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sellerEmail={listing.user.email}
      />
    </div>
  )
}

export default Page
