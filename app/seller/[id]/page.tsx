'use client'

import { useQuery } from '@apollo/client'
import { useParams } from 'next/navigation'
import { GET_SELLER_PROFILE } from '@/lib/graphql/queries/getSellerProfile'
import { GET_USER_REVIEWS } from '@/lib/graphql/queries/getUserReviews'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Star, Calendar, Phone, Shield, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { generateImageUrl } from '@/lib/utils'
import Image from 'next/image'
import type { Listing, Review } from '@/lib/graphql/types/trust'

export default function SellerProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const { data, loading, error } = useQuery(GET_SELLER_PROFILE, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network',
  })

  const user = data?.user

  const { data: reviewsData, loading: reviewsLoading } = useQuery(
    GET_USER_REVIEWS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    }
  )
  const reviews = reviewsData?.getUserReviews || []

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-32 bg-gray-200 rounded-lg mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='h-64 bg-gray-200 rounded-lg'></div>
            <div className='h-64 bg-gray-200 rounded-lg'></div>
            <div className='h-64 bg-gray-200 rounded-lg'></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-red-500'>
              Error loading seller profile: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-gray-500'>Seller not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeListings =
    user.listings?.filter((listing: Listing) => !listing.sold) || []

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
            <Avatar className='h-24 w-24'>
              <AvatarImage
                src={generateImageUrl(user.profileImageUrl)}
                alt={user.username}
                width={50}
                height={50}
              />
            </Avatar>

            <div className='flex-1'>
              <div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
                <div>
                  <h1 className='text-3xl font-bold'>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </h1>
                  <p className='text-gray-600'>@{user.username}</p>
                </div>

                <div className='flex items-center gap-2'>
                  {user.trustRating && (
                    <Badge
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      <Shield className='h-4 w-4' />
                      {user.trustRating.overallScore}% Trust Score
                    </Badge>
                  )}
                  {user.subscription?.planType === 'PREMIUM' && (
                    <Badge
                      variant='default'
                      className='bg-yellow-500'
                    >
                      Premium Seller
                    </Badge>
                  )}
                </div>
              </div>

              {user.bio && <p className='text-gray-700 mb-4'>{user.bio}</p>}

              <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                {user.customCity ||
                  (user.city
                    ? `${user.city.name}, ${user.city.region.name}, ${user.city.region.country.name}`
                    : '')}
                {user.contactNumber && (
                  <div className='flex items-center gap-1'>
                    <Phone className='h-4 w-4' />
                    {user.contactNumber}
                  </div>
                )}
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {user.createdAt &&
                  !isNaN(new Date(user.createdAt).getTime()) ? (
                    <>
                      Member since{' '}
                      {formatDistanceToNow(new Date(user.createdAt))} ago
                    </>
                  ) : (
                    <>Member since N/A</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Trust Rating & Verification */}
        <div className='lg:col-span-1'>
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                Trust & Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.trustRating && (
                <div className='space-y-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-green-600'>
                      {user.trustRating.overallScore}%
                    </div>
                    <div className='text-sm text-gray-600'>
                      Overall Trust Score
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Verification Score</span>
                      <span className='text-sm font-medium'>
                        {user.trustRating.verificationScore}%
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Profile Score</span>
                      <span className='text-sm font-medium'>
                        {user.trustRating.profileScore}%
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Review Score</span>
                      <span className='text-sm font-medium'>
                        {user.trustRating.reviewScore}%
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm'>Transaction Score</span>
                      <span className='text-sm font-medium'>
                        {user.trustRating.transactionScore}%
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className='text-center'>
                    <div className='text-lg font-semibold'>
                      {user.trustRating.totalReviews}
                    </div>
                    <div className='text-sm text-gray-600'>Total Reviews</div>
                    <div className='text-sm text-green-600'>
                      {user.trustRating.positiveReviews} positive
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {user.profileCompletion && (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Profile Photo</span>
                      {user.profileCompletion.hasProfilePhoto ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <Clock className='h-4 w-4 text-gray-400' />
                      )}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Email Verified</span>
                      {user.profileCompletion.hasVerifiedEmail ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <Clock className='h-4 w-4 text-gray-400' />
                      )}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Phone Verified</span>
                      {user.profileCompletion.hasVerifiedPhone ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <Clock className='h-4 w-4 text-gray-400' />
                      )}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>ID Verified</span>
                      {user.profileCompletion.hasIdVerification ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <Clock className='h-4 w-4 text-gray-400' />
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className='lg:col-span-2'>
          <Card className='mb-5'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Star className='h-5 w-5' />
                Reviews ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div>Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className='space-y-4'>
                  {reviews.map((review: Review) => (
                    <div
                      key={review.id}
                      className='border-b pb-2 mb-2'
                    >
                      <div className='font-semibold'>
                        {review.reviewer?.username}
                      </div>
                      <div>Rating: {review.rating}</div>
                      <div>{review.comment}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No reviews yet.</div>
              )}
            </CardContent>
          </Card>

          {/* Current Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Current Listings ({activeListings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {activeListings.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {activeListings.map((listing: Listing) => (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                    >
                      <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                        <CardContent className='p-4'>
                          <div className='flex gap-3'>
                            {listing.images && listing.images.length > 0 ? (
                              <Image
                                src={generateImageUrl(listing.images[0])}
                                height={50}
                                width={50}
                                alt={listing.title}
                                className='rounded-full w-12 h-12 object-cover'
                              />
                            ) : (
                              <div className='w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center'>
                                <span className='text-gray-400 text-xs'>
                                  No image
                                </span>
                              </div>
                            )}
                            <div className='flex-1'>
                              <h3 className='font-medium line-clamp-2'>
                                {listing.title}
                              </h3>
                              <p className='text-lg font-bold text-green-600'>
                                ${listing.price}
                              </p>
                              <div className='flex items-center gap-2 mt-1'>
                                <Badge variant='outline'>
                                  {listing.condition}
                                </Badge>
                                <Badge variant='secondary'>
                                  {listing.category?.name}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-8'>
                  No active listings
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
