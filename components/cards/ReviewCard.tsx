import { Star, User } from 'lucide-react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { Review } from '@/lib/graphql/types/trust'

interface ReviewCardProps {
  review: Review
  showListing?: boolean
}

export default function ReviewCard({ review, showListing = true }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="border border-secondary rounded-lg p-4 bg-componentBackground">
      <div className="flex items-start gap-3">
        {/* Reviewer Avatar */}
        <div className="flex-shrink-0">
          {review.reviewer.profileImageUrl ? (
            <Image
              src={`data:image/png;base64,${review.reviewer.profileImageUrl}`}
              alt={review.reviewer.username}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">
              {review.reviewer.username}
            </span>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Listing Info */}
          {showListing && (
            <div className="text-sm text-gray-600 mb-2">
              Review for: <span className="font-medium">{review.transaction.listing.title}</span>
            </div>
          )}

          {/* Review Comment */}
          {review.comment && (
            <p className="text-foreground mb-2">{review.comment}</p>
          )}

          {/* Review Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {dayjs(review.createdAt).format('MMM DD, YYYY')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              review.isPositive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {review.isPositive ? 'Positive' : 'Negative'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 