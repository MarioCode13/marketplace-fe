'use client'

import React, { useMemo, useState } from 'react'
import type { Review } from '@/lib/graphql/types/trust'
import { X, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useQuery } from '@apollo/client'
import { GET_USER_REVIEWS } from '@/lib/graphql/queries/getUserReviews'
import dayjs from 'dayjs'

interface StoreReviewsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  title?: string // optional store/user name to display
}

const REVIEWS_PER_PAGE = 5

export default function StoreReviewsModal({
  isOpen,
  onClose,
  userId,
  title,
}: StoreReviewsModalProps) {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all')
  const [page, setPage] = useState(0)

  const { data, loading, error } = useQuery(GET_USER_REVIEWS, {
    variables: { userId },
    fetchPolicy: 'network-only',
    skip: !isOpen || !userId,
  })

  const reviews: Review[] = useMemo(() => data?.getUserReviews || [], [data])

  const filtered = useMemo(() => {
    if (filter === 'all') return reviews
    if (filter === 'positive') return reviews.filter((r) => r.isPositive)
    return reviews.filter((r) => !r.isPositive)
  }, [reviews, filter])

  const totalPages = Math.ceil(filtered.length / REVIEWS_PER_PAGE)
  const paginatedReviews = filtered.slice(
    page * REVIEWS_PER_PAGE,
    (page + 1) * REVIEWS_PER_PAGE
  )

  const handleFilterChange = (newFilter: 'all' | 'positive' | 'negative') => {
    setFilter(newFilter)
    setPage(0) // Reset to first page when filter changes
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-componentBackground rounded-lg p-6 w-full max-w-2xl mx-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-foreground'>
            {title ? `${title} — Reviews` : 'Reviews'} ({reviews.length})
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            size='sm'
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'positive' ? 'contained' : 'outlined'}
            size='sm'
            onClick={() => handleFilterChange('positive')}
          >
            Positive
          </Button>
          <Button
            variant={filter === 'negative' ? 'contained' : 'outlined'}
            size='sm'
            onClick={() => handleFilterChange('negative')}
          >
            Negative
          </Button>
        </div>

        {loading ? (
          <div>Loading reviews...</div>
        ) : error ? (
          <div className='text-red-500'>Failed to load reviews</div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-8'>No reviews yet.</div>
        ) : (
          <>
            <div className='space-y-4 mb-4'>
              {paginatedReviews.map((review: Review) => (
                <div
                  key={review.id}
                  className='flex gap-3'
                >
                  <Avatar>
                    {review.reviewer?.profileImageUrl ? (
                      <AvatarImage
                        src={review.reviewer.profileImageUrl}
                        alt={review.reviewer.username}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <AvatarFallback>
                        {(review.reviewer?.username || 'U')[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-medium text-foreground'>
                          {review.reviewer?.username || 'Anonymous'}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {review.transaction?.listing?.title}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center'>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`w-4 h-4 ${
                                n <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {dayjs(review.createdAt).format('DD MMM YYYY')}
                        </div>
                      </div>
                    </div>

                    {review.comment && (
                      <p className='mt-2 text-sm text-foreground'>
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-4 mt-6 pt-4 border-t'>
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  size='icon'
                  variant='outlined'
                  className='rounded-full'
                >
                  <ChevronLeft className='w-4 h-4' />
                </Button>

                <span className='text-sm text-muted-foreground'>
                  Page {page + 1} of {totalPages}
                </span>

                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  size='icon'
                  variant='outlined'
                  className='rounded-full'
                >
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            )}
          </>
        )}

        <div className='mt-6 flex justify-end'>
          <Button
            variant='outlined'
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
