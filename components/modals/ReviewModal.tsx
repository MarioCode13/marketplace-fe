'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Review, Transaction } from '@/lib/graphql/types/trust'
import {
  CREATE_REVIEW,
  UPDATE_REVIEW,
} from '@/lib/graphql/mutations/reviewMutations'
import { useMutation } from '@apollo/client'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
  existingReview?: Review | null
  onReviewSubmitted?: () => void
}

export default function ReviewModal({
  isOpen,
  onClose,
  transaction,
  existingReview,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createReview] = useMutation(CREATE_REVIEW)
  const [updateReview] = useMutation(UPDATE_REVIEW)

  if (!isOpen) return null

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      if (existingReview) {
        // Update existing review
        await updateReview({
          variables: {
            reviewId: existingReview.id,
            rating,
            comment: comment.trim() || null,
          },
        })
        toast.success('Review updated successfully!')
      } else {
        // Create new review
        await createReview({
          variables: {
            transactionId: transaction.id,
            reviewedUserId: transaction.seller.id,
            rating,
            comment: comment.trim() || null,
          },
        })
        toast.success('Review submitted successfully!')
      }

      onReviewSubmitted?.()
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to submit review')
      } else {
        toast.error('Error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type='button'
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => handleStarHover(star)}
        onMouseLeave={handleStarLeave}
        className='transition-colors duration-200'
      >
        <Star
          className={`w-8 h-8 ${
            star <= (hoveredRating || rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ))
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-componentBackground rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-foreground'>
            {existingReview ? 'Edit Review' : 'Write a Review'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='mb-4'>
          <p className='text-sm text-gray-600 mb-2'>
            Review for:{' '}
            <span className='font-medium'>{transaction.listing.title}</span>
          </p>
          <p className='text-sm text-gray-600'>
            Seller:{' '}
            <span className='font-medium'>{transaction.seller.username}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          {/* Star Rating */}
          <div>
            <Label className='block mb-2'>Rating</Label>
            <div className='flex items-center gap-1'>
              {renderStars()}
              <span className='ml-2 text-sm text-gray-600'>
                {rating > 0 && `${rating}.0 stars`}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label
              htmlFor='comment'
              className='block mb-2'
            >
              Comment (optional)
            </Label>
            <Textarea
              id='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your experience with this seller...'
              rows={4}
              maxLength={500}
            />
            <p className='text-xs text-gray-500 mt-1'>
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className='flex gap-2 pt-4'>
            <Button
              type='button'
              variant='outlined'
              onClick={onClose}
              className='flex-1'
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1'
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting
                ? 'Submitting...'
                : existingReview
                ? 'Update Review'
                : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
