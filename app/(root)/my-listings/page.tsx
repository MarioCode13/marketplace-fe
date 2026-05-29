'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery, useMutation } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SkeletonListingCard from '@/components/cards/SkeletonListingCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MY_LISTINGS } from '@/lib/graphql/queries/myListings'
import { GET_LISTINGS } from '@/lib/graphql/queries/getListings'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import {
  DELETE_LISTING,
  LISTING_BOOST_CHECKOUT_URL,
} from '@/lib/graphql/mutations/listingMutations'
import {
  BOOSTED_HOME_LISTINGS,
  LISTING_BOOST_PRICE_ZAR,
} from '@/lib/graphql/queries/boostedHomeListings'
import { useMeQuery } from '@/lib/graphql/generated'
import useListingBoost from '@/lib/hooks/useListingBoost'
import { LISTING_BOOST_GRAPHQL_INLINE_ACTIVATION } from '@/lib/constants/listingBoostCheckout'
import ListingCard from '@/components/cards/ListingCard'
import MarkAsSoldModal from '@/components/modals/MarkAsSoldModal'
import {
  Listing as TrustListing,
  Condition as TrustCondition,
} from '@/lib/graphql/types/trust'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { BoostCreditBalance, Listing, PlanType } from '@/lib/graphql/generated'
import { REFERRAL_QUERY_PARAM } from '@/lib/constants/referral'

// Using generated TrustListing type from lib/graphql/types/trust

export default function MyListingsPage() {
  const [limit] = useState(9)
  const [offset, setOffset] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [markAsSoldOpen, setMarkAsSoldOpen] = useState(false)
  const [selectedListingForSale, setSelectedListingForSale] = useState<
    string | null
  >(null)
  const [boostListingId, setBoostListingId] = useState<string | null>(null)
  const [boostDurationDays, setBoostDurationDays] = useState<7 | 14 | 30>(30)
  const [boostCouponCode, setBoostCouponCode] = useState('')
  const [referralShareUrl, setReferralShareUrl] = useState<string | null>(null)
  const [referralDialogOpen, setReferralDialogOpen] = useState(false)

  const router = useRouter()
  const userContext = useSelector((state: RootState) => state.userContext)
  const userId = userContext.userId

  const { data: myBusinessData } = useQuery(GET_MY_BUSINESS)

  const isBusinessUser = !!myBusinessData?.myBusiness
  const businessId = myBusinessData?.myBusiness?.id

  const { loading, error, data, refetch } = useQuery(
    isBusinessUser ? GET_LISTINGS : MY_LISTINGS,
    {
      variables: isBusinessUser
        ? { limit, offset, businessId }
        : { limit, offset },
    },
  )

  const [deleteListing] = useMutation(DELETE_LISTING)
  const [listingBoostCheckout, { loading: boostCheckoutLoading }] = useMutation(
    LISTING_BOOST_CHECKOUT_URL,
  )
  const {
    activateBoost,
    loading: boostActivateLoading,
    error: boostActivateError,
  } = useListingBoost()

  const { data: boostedHomeData } = useQuery(BOOSTED_HOME_LISTINGS, {
    variables: { limit: 100 },
  })

  const boostedListingIds = new Set(
    boostedHomeData?.boostedHomeListings?.map(
      (item: { id: string }) => item.id,
    ) || [],
  )

  const { data: boostPriceData } = useQuery(LISTING_BOOST_PRICE_ZAR, {
    variables: { durationDays: boostDurationDays },
    skip: !boostListingId,
  })

  const { data: meData, refetch: refetchMe } = useMeQuery({
    skip: !userId,
    errorPolicy: 'all',
  })
  const boostCreditBalances: BoostCreditBalance[] =
    meData?.me?.boostCreditBalances?.filter((b) => b.available > 0) ?? []
  const sevenDayCredits =
    boostCreditBalances.find((b) => b.durationDays === 7)?.available ?? 0
  const proBoostsLeft = meData?.me?.proStoreSevenDayBoostsRemainingThisMonth
  const myReferralCode = meData?.me?.referralCode
  const referralSignupsRemaining = meData?.me?.referralSignupsRemainingThisMonth

  useEffect(() => {
    if (!myReferralCode) {
      setReferralShareUrl(null)
      return
    }
    const path = `/register?${REFERRAL_QUERY_PARAM}=${encodeURIComponent(myReferralCode)}`
    setReferralShareUrl(`${window.location.origin}${path}`)
  }, [myReferralCode])

  const copyReferralLink = async () => {
    if (!referralShareUrl) return
    try {
      await navigator.clipboard.writeText(referralShareUrl)
      toast.success('Referral link copied')
    } catch {
      toast.error('Could not copy link')
    }
  }

  const copyReferralCode = async () => {
    if (!myReferralCode) return
    try {
      await navigator.clipboard.writeText(myReferralCode)
      toast.success('Referral code copied')
    } catch {
      toast.error('Could not copy code')
    }
  }

  const creditApplies = boostDurationDays === 7 && sevenDayCredits > 0

  const allListings: Listing[] = isBusinessUser
    ? data?.getListings?.listings || []
    : data?.myListings?.listings || []

  const isBoostLoading = boostActivateLoading || boostCheckoutLoading

  // Filter out sold listings
  const listings = allListings.filter((listing) => !listing.sold)
  const totalCount: number = listings.length

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
      toast.error(
        'Failed to delete listing. Please try again. ' +
          (error as Error).message,
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setListingToDelete(null)
  }

  const handleBoostConfirm = async () => {
    if (!boostListingId) return

    try {
      const trimmedBoostCoupon = boostCouponCode.trim()
      const result = await activateBoost(
        boostListingId,
        boostDurationDays,
        trimmedBoostCoupon || undefined,
      )

      const redirectUrl = result.url || result.redirectUrl
      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }

      if (result.success) {
        toast.success(result.message || 'Listing boost activated successfully')
        setBoostListingId(null)
        setBoostCouponCode('')
        await refetch()
        await refetchMe()
        return
      }

      // Fallback to GraphQL checkout URL if REST activation didn't return redirect
      const { data: boostData } = await listingBoostCheckout({
        variables: {
          listingId: boostListingId,
          durationDays: boostDurationDays,
          ...(trimmedBoostCoupon ? { couponCode: trimmedBoostCoupon } : {}),
        },
      })

      const url = boostData?.listingBoostCheckoutUrl
      if (url === LISTING_BOOST_GRAPHQL_INLINE_ACTIVATION) {
        toast.success('Listing boost activated successfully')
        setBoostListingId(null)
        setBoostCouponCode('')
        await refetch()
        await refetchMe()
        return
      }
      if (url) {
        window.location.href = url
        return
      }

      toast.error(
        result.message || 'Could not start payment. Please try again.',
      )
    } catch (e) {
      const message = (e as Error).message || 'Could not start boost checkout.'
      toast.error(message)
    }
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='flex flex-col py-12 px-6 w-full max-w-7xl'>
        {userId ? (
          <>
            <div className='flex items-center justify-between w-full mb-6'>
              <div className='w-32'></div> {/* Spacer */}
              <div className='flex items-center gap-4'>
                <h1 className='text-2xl font-bold'>
                  {isBusinessUser
                    ? `${myBusinessData.myBusiness.name} Listings`
                    : 'My Listings'}
                </h1>
              </div>
              <div className='flex items-center gap-4'>
                <Link href={isBusinessUser ? '/sell?business=1' : '/sell'}>
                  <Button
                    color={'secondary'}
                    variant={'contained'}
                  >
                    Sell New Item
                  </Button>
                </Link>
              </div>
            </div>
            {(boostCreditBalances.length > 0 || myReferralCode) && (
              <div className='mb-6 flex flex-col gap-3'>
                {boostCreditBalances.length > 0 && (
                  <div className='text-sm text-slate-700 dark:text-slate-300'>
                    <span className='font-semibold'>
                      {boostCreditBalances.reduce(
                        (sum, balance) => sum + balance.available,
                        0,
                      )}
                    </span>{' '}
                    boost credit
                    {boostCreditBalances.reduce(
                      (sum, balance) => sum + balance.available,
                      0,
                    ) === 1
                      ? ''
                      : 's'}{' '}
                    available — use Boost on a listing to apply one at no
                    charge.
                  </div>
                )}
                {myReferralCode && (
                  <div className='flex justify-end'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <Button
                        type='button'
                        variant='outlined'
                        color='primary'
                        onClick={() => setReferralDialogOpen(true)}
                      >
                        Referral link
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {typeof proBoostsLeft === 'number' && proBoostsLeft === 0 && (
              <p className='mb-6 text-sm text-amber-800 dark:text-amber-200'>
                Your Pro Store included 7-day boosts for this month are used up.
                {sevenDayCredits > 0
                  ? ' You still have other 7-day credits available above.'
                  : ' You can still boost at the standard rate or choose 14 or 30 days.'}
              </p>
            )}
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
                    listing={{
                      id: listing.id,
                      title: listing.title,
                      description: listing.description,
                      price: String(listing.price),
                      images: listing.images,
                      createdAt: listing.createdAt,
                      sold: listing.sold,
                      nsfwApprovalStatus: listing.nsfwApprovalStatus,
                      user: listing.user ?? undefined,
                      business: listing.business || undefined,
                    }}
                    isBoosted={boostedListingIds.has(listing.id)}
                    showMenu
                    onEdit={() => router.push(`/edit-listing/${listing.id}`)}
                    onDelete={() => handleDeleteClick(listing.id)}
                    onMarkAsSold={() => {
                      setSelectedListingForSale(listing.id)
                      setMarkAsSoldOpen(true)
                    }}
                    onBoost={
                      !boostedListingIds.has(listing.id) &&
                      (!listing.nsfwApprovalStatus ||
                        listing.nsfwApprovalStatus === 'APPROVED')
                        ? () => {
                            setBoostDurationDays(30)
                            setBoostListingId(listing.id)
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <p className='text-gray-600 mb-4'>
                  {isBusinessUser
                    ? 'Your business does not have any active listings.'
                    : "You don't have any active listings."}
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
        open={!!boostListingId}
        onOpenChange={(open) => {
          if (!open) {
            setBoostListingId(null)
            setBoostCouponCode('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Boost your listing</DialogTitle>
            <DialogDescription>
              Feature this listing on the home page for the period you choose.
              {creditApplies ? (
                <>
                  {' '}
                  You have {sevenDayCredits} seven-day boost credit
                  {sevenDayCredits === 1 ? '' : 's'} available to apply at no
                  charge.
                </>
              ) : (
                <>
                  {' '}
                  You will be redirected to PayFast to complete payment unless a
                  promo covers the full amount.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Duration
              <select
                className='mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm'
                value={boostDurationDays}
                onChange={(e) =>
                  setBoostDurationDays(Number(e.target.value) as 7 | 14 | 30)
                }
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </label>
            {boostPriceData != null && (
              <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                {creditApplies ? (
                  <>
                    Total: R0.00{' '}
                    <span className='text-sm font-normal text-gray-600 dark:text-gray-400'>
                      ({sevenDayCredits} seven-day credit
                      {sevenDayCredits === 1 ? '' : 's'} available)
                    </span>
                  </>
                ) : (
                  <>
                    Total: R
                    {Number(boostPriceData.listingBoostPriceZar).toFixed(2)}
                  </>
                )}
              </p>
            )}
            {boostDurationDays === 7 &&
              meData?.me?.planType === PlanType.ProStore &&
              typeof proBoostsLeft === 'number' &&
              proBoostsLeft === 0 &&
              sevenDayCredits === 0 && (
                <p className='text-sm text-amber-700 dark:text-amber-300'>
                  No 7-day boost credits available. Pay the standard rate or
                  pick 14 or 30 days.
                </p>
              )}
            <div className='space-y-2'>
              <Label
                htmlFor='boost-coupon'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Promo code (optional)
              </Label>
              <Input
                id='boost-coupon'
                value={boostCouponCode}
                onChange={(e) => setBoostCouponCode(e.target.value)}
                placeholder='Enter code if you have one'
                className='bg-white dark:bg-gray-900'
                autoComplete='off'
              />
            </div>
            {boostActivateError && (
              <p className='text-sm text-red-500 mt-2'>{boostActivateError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setBoostListingId(null)}
              disabled={isBoostLoading}
            >
              Cancel
            </Button>
            <Button
              variant={'contained'}
              onClick={() => void handleBoostConfirm()}
              disabled={isBoostLoading}
            >
              {isBoostLoading
                ? 'Processing…'
                : creditApplies
                  ? 'Use boost credit'
                  : 'Pay with PayFast'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={referralDialogOpen}
        onOpenChange={setReferralDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Referral link</DialogTitle>
            <DialogDescription>
              Share your referral link to earn up to two 7-day boosts per
              signup.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            {referralSignupsRemaining != null && (
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                {referralSignupsRemaining > 0 ? (
                  <>
                    You have{' '}
                    <span className='font-semibold'>
                      {referralSignupsRemaining}
                    </span>{' '}
                    rewarded signup
                    {referralSignupsRemaining === 1 ? '' : 's'} remaining this
                    month.
                  </>
                ) : (
                  <>Your monthly referral reward limit has been reached.</>
                )}
              </p>
            )}
            <div className='space-y-2'>
              <div>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Referral code
                </p>
                <div className='mt-1 flex items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm text-slate-900 dark:bg-slate-900 dark:text-slate-100'>
                  <span className='font-mono'>{myReferralCode}</span>
                  <Button
                    type='button'
                    variant='outlined'
                    color='primary'
                    className='text-xs'
                    onClick={() => void copyReferralCode()}
                  >
                    Copy code
                  </Button>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Referral link
                </p>
                <div className='mt-1 flex items-center gap-2 rounded bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:bg-slate-900 dark:text-slate-100'>
                  <code className='flex-1 min-w-0 truncate'>
                    {referralShareUrl}
                  </code>
                  <Button
                    type='button'
                    variant='outlined'
                    color='primary'
                    className='text-xs'
                    onClick={() => void copyReferralLink()}
                  >
                    Copy link
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setReferralDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Mark As Sold Modal */}
      {selectedListingForSale &&
        (() => {
          const base = listings.find((l) => l.id === selectedListingForSale)
          if (!base) return null

          // Map the generated listing to the trust listing type expected by the modal
          const modalListing: TrustListing = {
            id: base.id,
            title: base.title || '',
            description: base.description || '',
            images: base.images || [],
            price: Number(base.price) || 0,
            sold: !!base.sold,
            createdAt: base.createdAt || new Date().toISOString(),
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            condition: TrustCondition.GOOD,
            category: base.category
              ? { id: base.category.id, name: base.category.name }
              : undefined,
            city: base.city
              ? {
                  id: base.city.id,
                  name: base.city.name,
                  region: { name: '', country: { name: '' } },
                }
              : undefined,
            customCity: base.customCity || undefined,
            user: base.user
              ? {
                  id: base.user.id,
                  username: base.user.username,
                  email: base.user.email || '',
                  role: base.user.email ? 'user' : '',
                  createdAt: base.user.createdAt || new Date().toISOString(),
                }
              : {
                  id: userId || '',
                  username: 'Unknown',
                  email: '',
                  role: '',
                  createdAt: new Date().toISOString(),
                },
          }

          return (
            <MarkAsSoldModal
              isOpen={markAsSoldOpen}
              onClose={() => setMarkAsSoldOpen(false)}
              listing={modalListing}
              onSuccess={async () => {
                setMarkAsSoldOpen(false)
                setSelectedListingForSale(null)
                await refetch()
              }}
            />
          )
        })()}
    </div>
  )
}
