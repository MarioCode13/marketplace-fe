'use client'

import { useQuery } from '@apollo/client'
import { TrustRating } from '@/components/ui/trust-rating'
import ReviewCard from '@/components/cards/ReviewCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, User } from 'lucide-react'
import Image from 'next/image'
import {
  GET_TRUST_RATING,
  GET_USER_REVIEWS,
  // GET_USER_POSITIVE_REVIEWS,
  // GET_USER_NEGATIVE_REVIEWS,
  GET_USER_AVERAGE_RATING,
  GET_USER_REVIEW_COUNT,
  GET_USER_POSITIVE_REVIEW_COUNT,
} from '@/lib/graphql/queries'
import { Review } from '@/lib/graphql/types/trust'

interface TrustProfileProps {
  userId: string
  user: {
    id: string
    username: string
    profileImageUrl?: string
  }
}

export default function TrustProfile({ userId, user }: TrustProfileProps) {
  const { data: trustData, loading: trustLoading } = useQuery(
    GET_TRUST_RATING,
    {
      variables: { userId },
      skip: !userId,
    }
  )

  const { data: reviewsData, loading: reviewsLoading } = useQuery(
    GET_USER_REVIEWS,
    {
      variables: { userId },
      skip: !userId,
    }
  )

  // const { data: positiveReviewsData } = useQuery(GET_USER_POSITIVE_REVIEWS, {
  //   variables: { userId },
  //   skip: !userId,
  // })

  // const { data: negativeReviewsData } = useQuery(GET_USER_NEGATIVE_REVIEWS, {
  //   variables: { userId },
  //   skip: !userId,
  // })

  const { data: averageRatingData } = useQuery(GET_USER_AVERAGE_RATING, {
    variables: { userId },
    skip: !userId,
  })

  const { data: reviewCountData } = useQuery(GET_USER_REVIEW_COUNT, {
    variables: { userId },
    skip: !userId,
  })

  const { data: positiveReviewCountData } = useQuery(
    GET_USER_POSITIVE_REVIEW_COUNT,
    {
      variables: { userId },
      skip: !userId,
    }
  )

  if (trustLoading || reviewsLoading) {
    return <div className='animate-pulse'>Loading trust profile...</div>
  }

  const trustRating = trustData?.getTrustRating
  const reviews = reviewsData?.getUserReviews || []
  const averageRating = averageRatingData?.getUserAverageRating || 0
  const reviewCount = reviewCountData?.getUserReviewCount || 0
  const positiveReviewCount =
    positiveReviewCountData?.getUserPositiveReviewCount || 0

  return (
    <div className='space-y-6'>
      {/* Trust Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='w-5 h-5' />
            Trust Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 mb-4'>
            {user.profileImageUrl ? (
              <Image
                src={`data:image/png;base64,${user.profileImageUrl}`}
                alt={user.username}
                width={60}
                height={60}
                className='rounded-full object-cover'
              />
            ) : (
              <div className='w-15 h-15 bg-gray-200 rounded-full flex items-center justify-center'>
                <User className='w-8 h-8 text-gray-500' />
              </div>
            )}
            <div>
              <h3 className='text-lg font-semibold'>{user.username}</h3>
              {trustRating && (
                <TrustRating
                  overallScore={trustRating.overallScore}
                  totalReviews={trustRating.totalReviews}
                  positiveReviews={trustRating.positiveReviews}
                  trustLevel={trustRating.trustLevel}
                  showDetails={true}
                  size='lg'
                />
              )}
            </div>
          </div>
          {trustRating && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {trustRating.overallScore.toFixed(1)}
                </div>
                <div className='text-sm text-gray-600'>Overall Score</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {trustRating.documentScore.toFixed(1)}
                </div>
                <div className='text-sm text-gray-600'>Document Score</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {trustRating.profileScore.toFixed(1)}
                </div>
                <div className='text-sm text-gray-600'>Profile Score</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  {trustRating.reviewScore.toFixed(1)}
                </div>
                <div className='text-sm text-gray-600'>Review Score</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>
                {positiveReviewCount}
              </div>
              <div className='text-sm text-gray-600'>Positive Reviews</div>
            </div>
            <div className='text-center p-4 bg-red-50 rounded-lg'>
              <div className='text-2xl font-bold text-red-600'>
                {reviewCount - positiveReviewCount}
              </div>
              <div className='text-sm text-gray-600'>Negative Reviews</div>
            </div>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>
                {averageRating.toFixed(1)}
              </div>
              <div className='text-sm text-gray-600'>Average Rating</div>
            </div>
          </div>

          {/* Reviews List */}
          <div className='space-y-4'>
            {reviews.length > 0 ? (
              reviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                />
              ))
            ) : (
              <p className='text-center text-gray-500 py-8'>No reviews yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
