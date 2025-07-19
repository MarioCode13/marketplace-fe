'use client'

import { GET_LISTING_BY_ID } from '@/lib/graphql/queries'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import ContactSellerModal from '@/components/modals/ContactSellerModal'
import MarkAsSoldModal from '@/components/modals/MarkAsSoldModal'
import { Button } from '@/components/ui/button'
import {
  User,
  Shield,
  Star,
  DollarSign,
  Edit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { generateImageUrl } from '@/lib/utils'
import { GET_ME } from '@/lib/graphql/queries/getMe'

const Page = () => {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [modalOpen, setModalOpen] = useState(false)
  const [markAsSoldModalOpen, setMarkAsSoldModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { user } = useSelector((state: RootState) => state.auth)

  const { data: meData } = useQuery(GET_ME, {
    skip: !user,
  })

  const { data, loading, error } = useQuery(GET_LISTING_BY_ID, {
    variables: { id },
    skip: !id,
  })

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        data?.getListingById?.images &&
        data.getListingById.images.length > 1
      ) {
        if (event.key === 'ArrowLeft') {
          setSelectedImageIndex((prev) =>
            prev === 0 ? data.getListingById.images.length - 1 : prev - 1
          )
        } else if (event.key === 'ArrowRight') {
          setSelectedImageIndex((prev) =>
            prev === data.getListingById.images.length - 1 ? 0 : prev + 1
          )
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [data?.getListingById?.images])

  if (loading) {
    return (
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-4xl py-8 px-6'>
          <Skeleton className='h-10 w-3/4 mb-4' />
          <Skeleton className='h-6 w-1/3 mb-6' />
          <Skeleton className='h-80 w-full rounded-lg' />
        </div>
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
  const currentUserId = meData?.me?.id || user?.id || user?.userId
  const isOwner = currentUserId === listing.user.id

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full max-w-5xl py-8 px-6'>
        {/* Image Gallery & Details */}
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='md:w-1/2 relative'>
            <div className='relative w-full h-[460px] rounded-lg shadow-lg overflow-hidden'>
              <Image
                src={
                  listing.images && listing.images.length > 0
                    ? generateImageUrl(listing.images[selectedImageIndex])
                    : '/logo.png'
                }
                alt={listing.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>

            {/* Navigation arrows - only show if there are multiple images */}
            {listing.images && listing.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? listing.images.length - 1 : prev - 1
                    )
                  }
                  className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === listing.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </>
            )}

            <div className='flex gap-2 mt-4 overflow-x-auto'>
              {listing.images &&
                listing.images.map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 rounded-md cursor-pointer border-2 transition-all hover:border-black flex-shrink-0 ${
                      index === selectedImageIndex
                        ? 'border-blue-500 shadow-md'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={generateImageUrl(imageUrl)}
                      alt={`Preview ${index}`}
                      fill
                      className='object-cover rounded-md'
                      sizes='80px'
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className='md:w-1/2 space-y-6 flex flex-col justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>{listing.title}</h1>
              <p className='text-gray-600'>{listing.description}</p>
              <p className='text-2xl font-semibold text-green-600'>
                ${listing.price}
              </p>
              <p className='text-sm text-gray-500'>
                Location:{' '}
                {listing.customCity ||
                  (listing.city
                    ? `${listing.city.name}, ${listing.city.region.name}, ${listing.city.region.country.name}`
                    : '')}
              </p>
              <Badge className='w-fit'>{listing.condition}</Badge>
            </div>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center gap-4 mb-3'>
                  {listing.user.profileImageUrl === null ? (
                    <User className='w-6 h-6' />
                  ) : (
                    <Image
                      src={generateImageUrl(listing.user.profileImageUrl)}
                      height={50}
                      width={50}
                      alt='profile'
                      className='rounded-full w-12 h-12 object-cover'
                    />
                  )}

                  <div className='flex-1'>
                    <p className='text-gray-500 text-sm'>Seller</p>
                    {listing.user.storeBranding?.slug ? (
                      <Link
                        href={`/store/${listing.user.storeBranding.slug}`}
                        className='hover:underline'
                      >
                        <h2 className='text-lg font-semibold'>
                          {listing.user.username}
                        </h2>
                      </Link>
                    ) : (
                      <Link
                        href={`/seller/${listing.user.id}`}
                        className='hover:underline'
                      >
                        <h2 className='text-lg font-semibold'>
                          {listing.user.username}
                        </h2>
                      </Link>
                    )}
                  </div>
                  {isOwner ? (
                    <div className='flex gap-2'>
                      <Button
                        onClick={() =>
                          router.push(`/edit-listing/${listing.id}`)
                        }
                        variant='outline'
                        className='flex items-center gap-2'
                        disabled={listing.sold}
                      >
                        <Edit className='w-4 h-4' />
                        Edit
                      </Button>
                      <Button
                        onClick={() => setMarkAsSoldModalOpen(true)}
                        className='flex items-center gap-2'
                        disabled={listing.sold}
                      >
                        <DollarSign className='w-4 h-4' />
                        {listing.sold ? 'Already Sold' : 'Mark as Sold'}
                      </Button>
                    </div>
                  ) : (
                    <div className='flex gap-2'>
                      {listing.user.storeBranding?.slug ? (
                        <Link
                          href={`/store/${listing.user.storeBranding.slug}`}
                        >
                          <Button
                            variant='outline'
                            className='flex items-center gap-2'
                          >
                            <User className='w-4 h-4' />
                            View Store
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/seller/${listing.user.id}`}>
                          <Button
                            variant='outline'
                            className='flex items-center gap-2'
                          >
                            <User className='w-4 h-4' />
                            View Profile
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={() => setModalOpen(true)}
                        variant='secondary'
                      >
                        Contact Seller
                      </Button>
                    </div>
                  )}
                </div>

                {!isOwner && (
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
                      <span className='text-sm text-gray-600'>
                        (12 reviews)
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <ContactSellerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          sellerEmail={listing.user.email}
        />

        <MarkAsSoldModal
          isOpen={markAsSoldModalOpen}
          onClose={() => setMarkAsSoldModalOpen(false)}
          listing={listing}
          onSuccess={() => {
            // Refetch the listing data to show updated sold status
            window.location.reload()
          }}
        />
      </div>
    </div>
  )
}

export default Page
