'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery, useMutation } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MY_LISTINGS } from '@/lib/graphql/queries/myListings'
import { DELETE_LISTING } from '@/lib/graphql/mutations/listingMutations'
import ListingCard from '@/components/cards/ListingCard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

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
  const [limit] = useState(9)
  const [offset, setOffset] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  const { loading, error, data, refetch } = useQuery(MY_LISTINGS, {
    variables: { limit, offset },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const [deleteListing] = useMutation(DELETE_LISTING, {
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

  const handleDeleteClick = (listingId: string) => {
    setListingToDelete(listingId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return

    setIsDeleting(true)
    try {
      await deleteListing({
        variables: { listingId: listingToDelete },
      })

      toast.success('Listing deleted successfully')
      setDeleteDialogOpen(false)
      setListingToDelete(null)

      // Refetch the listings to update the UI
      await refetch()
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast.error('Failed to delete listing. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setListingToDelete(null)
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
                  <Button color={'secondary'}>Sell New Item</Button>
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
                    onDelete={() => handleDeleteClick(listing.id)}
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
                  variant={'outlined'}
                  className='rounded-full disabled:opacity-50'
                >
                  <ChevronLeft />
                </Button>

                <div className='text-sm text-gray-600'>
                  {Math.floor(offset / limit) + 1} of{' '}
                  {Math.ceil(totalCount / limit)}
                </div>

                <Button
                  onClick={handleNext}
                  size={'icon'}
                  variant={'outlined'}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color={'primary'}
              variant='outlined'
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
