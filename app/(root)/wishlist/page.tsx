'use client'

import { useEffect, useCallback, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { selectIsLoggedIn } from '@/store/userContextSlice'
import {
  useAddToWatchlistMutation,
  useMyWatchlistQuery,
  useRemoveFromWatchlistMutation,
} from '@/lib/graphql/generated'
import ListingCard from '@/components/cards/ListingCard'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { toast } from 'sonner'

const PAGE_SIZE = 24

export default function WishlistPage() {
  const router = useRouter()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const [offset, setOffset] = useState(0)
  const [wishlistPendingId, setWishlistPendingId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login')
    }
  }, [isLoggedIn, router])

  const { data, loading, refetch } = useMyWatchlistQuery({
    variables: { limit: PAGE_SIZE, offset },
    skip: !isLoggedIn,
    fetchPolicy: 'cache-and-network',
  })

  const [addToWatchlist] = useAddToWatchlistMutation()
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation()

  const page = data?.myWatchlist
  const listings = useMemo(
    () => data?.myWatchlist?.listings ?? [],
    [data],
  )
  const totalCount = page?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  const wishlistIdSet = useMemo(
    () => new Set(listings.map((l) => l.id)),
    [listings],
  )

  const handleWishlistToggle = useCallback(
    async (listingId: string) => {
      const currentlyOn = wishlistIdSet.has(listingId)
      setWishlistPendingId(listingId)
      try {
        if (currentlyOn) {
          await removeFromWatchlist({ variables: { listingId } })
          toast.success('Removed from wishlist')
        } else {
          await addToWatchlist({ variables: { listingId } })
          toast.success('Saved to wishlist')
        }
        await refetch()
      } catch {
        toast.error('Could not update wishlist. Try again.')
      } finally {
        setWishlistPendingId(null)
      }
    },
    [addToWatchlist, refetch, removeFromWatchlist, wishlistIdSet],
  )

  if (!isLoggedIn) {
    return (
      <Container className='py-16 text-center text-muted-foreground'>
        Redirecting to sign in…
      </Container>
    )
  }

  return (
    <Container className='py-8 max-w-7xl'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold'>Wishlist</h1>
        <p className='text-muted-foreground mt-1'>
          Listings you have saved. Click the heart again to remove.
        </p>
      </div>

      {loading && listings.length === 0 ? (
        <p className='text-muted-foreground'>Loading…</p>
      ) : listings.length === 0 ? (
        <div className='text-center py-16 border border-dashed rounded-lg'>
          <p className='text-muted-foreground mb-4'>Your wishlist is empty.</p>
          <Button
            asChild
            color='primary'
            variant='contained'
          >
            <Link href='/listings'>Browse listings</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className='text-sm text-muted-foreground mb-4'>
            {totalCount} saved listing{totalCount !== 1 ? 's' : ''}
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={{
                  id: listing.id,
                  title: listing.title,
                  description: listing.description,
                  price: listing.price,
                  images: listing.images,
                  createdAt: listing.createdAt,
                  sold: listing.sold,
                  nsfwApprovalStatus: listing.nsfwApprovalStatus,
                  user: listing.user
                    ? {
                        id: listing.user.id,
                        username: listing.user.username,
                        trustRating: listing.user.trustRating
                          ? {
                              verifiedId:
                                listing.user.trustRating.verifiedId ?? false,
                              starRating:
                                listing.user.trustRating.starRating ?? undefined,
                              totalReviews:
                                listing.user.trustRating.totalReviews ??
                                undefined,
                            }
                          : null,
                      }
                    : null,
                  business: listing.business
                    ? {
                        name: listing.business.name,
                        trustRating: listing.business.trustRating
                          ? {
                              verifiedWithThirdParty:
                                listing.business.trustRating
                                  .verifiedWithThirdParty ?? false,
                              averageRating:
                                listing.business.trustRating.averageRating ??
                                undefined,
                              reviewCount:
                                listing.business.trustRating.reviewCount ??
                                undefined,
                            }
                          : null,
                      }
                    : undefined,
                }}
                showWishlistHeart
                wishlisted={wishlistIdSet.has(listing.id)}
                wishlistLoading={wishlistPendingId === listing.id}
                onWishlistHeartClick={() => handleWishlistToggle(listing.id)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className='flex justify-center gap-4 mt-10'>
              <Button
                variant='outlined'
                color='primary'
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              >
                Previous
              </Button>
              <span className='self-center text-sm text-muted-foreground'>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant='outlined'
                color='primary'
                disabled={offset + PAGE_SIZE >= totalCount}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  )
}
