import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import { Heart, MoreVertical, ShieldCheck, Star, StarIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { generateImageUrl } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface CardListing {
  id: string
  title: string
  description: string
  price: string | number
  images: string[]
  createdAt: string
  sold?: boolean
  nsfwApprovalStatus?: string | null
  user?: {
    id: string
    username: string
    trustRating?: {
      overallScore?: number
      starRating?: number
      trustLevel?: string
      totalReviews?: number
      positiveReviews?: number
      verifiedId?: boolean
    } | null
  } | null
  business?: {
    name: string
    trustRating?: {
      verifiedWithThirdParty?: boolean
      averageRating?: number
      reviewCount?: number
    } | null
  }
}

interface ListingCardProps {
  listing: CardListing
  themeColor?: string
  primaryColor?: string
  cardTextColor?: string
  showMenu?: boolean
  store?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onMarkAsSold?: () => void
  onBoost?: () => void
  isBoosted?: boolean
  showWishlistHeart?: boolean
  wishlisted?: boolean
  wishlistLoading?: boolean
  onWishlistHeartClick?: () => void
}

export default function ListingCard({
  listing,
  showMenu = false,
  onEdit,
  onDelete,
  primaryColor,
  cardTextColor,
  store,
  onMarkAsSold,
  onBoost,
  isBoosted = false,
  showWishlistHeart = false,
  wishlisted = false,
  wishlistLoading = false,
  onWishlistHeartClick,
}: ListingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const [wishlistAnimate, setWishlistAnimate] = useState(false)
  const prevWishlisted = useRef(wishlisted)

  useEffect(() => {
    if (prevWishlisted.current !== wishlisted) {
      setWishlistAnimate(true)
      const timeout = window.setTimeout(() => setWishlistAnimate(false), 1500)
      prevWishlisted.current = wishlisted
      return () => window.clearTimeout(timeout)
    }

    prevWishlisted.current = wishlisted
  }, [wishlisted])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  // Only apply custom colors if in store context and colors are provided
  const cardStyle =
    store && primaryColor
      ? { background: primaryColor, color: cardTextColor || '#222' }
      : undefined

  return (
    <div
      className='relative'
      data-testid='listing-card'
    >
      <Link
        href={`/listing/${listing.id}`}
        passHref
      >
        <div
          className={`p-4 rounded-lg shadow-lg h-[420px] flex flex-col cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl hover:opacity-80 hover:scale-[1.02] ${
            listing.sold ? 'opacity-60' : ''
          } ${!primaryColor ? 'bg-componentBackground' : ''}`}
          style={cardStyle}
        >
          {isBoosted && (
            <div className='absolute top-2 left-2 z-20'>
              <Badge className='bg-yellow-400 text-black gap-1'>
                <StarIcon size={16} /> Boosted
              </Badge>
            </div>
          )}
          {listing.sold && (
            <div className='absolute top-2 right-2 z-10'>
              <Badge className='bg-red-500 text-white'>SOLD</Badge>
            </div>
          )}
          <div className='relative w-full overflow-hidden rounded-md aspect-[4/3] sm:aspect-[16/9]'>
            <Image
              src={
                listing.images && listing.images.length > 0
                  ? generateImageUrl(listing.images[0])
                  : '/logo.png'
              }
              alt={listing.title}
              fill
              className='object-cover'
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/logo.png'
              }}
            />
          </div>
          <div className='flex-1 flex flex-col justify-between mt-2'>
            <div>
              <h2
                className='text-xl font-semibold mb-2 line-clamp-2 leading-snug'
                style={cardTextColor ? { color: cardTextColor } : undefined}
              >
                {listing.title}
              </h2>
              <p
                className='text-foreground line-clamp-2'
                style={cardTextColor ? { color: cardTextColor } : undefined}
              >
                {listing.description}
              </p>
            </div>

            <div>
              <p
                className={`font-bold ${
                  listing.sold ? 'text-gray-500 line-through' : 'text-success'
                }`}
                data-testid='listing-price'
              >
                R
                {typeof listing.price === 'number'
                  ? listing.price
                  : listing.price}
              </p>

              <div className='mt-2 space-y-1'>
                {!store && (
                  <>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm text-gray-500'>
                        {listing.business?.name ||
                          listing.user?.username ||
                          'Unknown'}
                      </p>
                      {(listing.business?.trustRating?.verifiedWithThirdParty ||
                        (!listing.business &&
                          listing.user?.trustRating?.verifiedId)) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ShieldCheck className='w-4 h-4 text-success' />
                            </TooltipTrigger>
                            <TooltipContent side='top'>
                              <p>Verified</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {(listing.user?.trustRating?.starRating ||
                      listing.business?.trustRating?.averageRating) && (
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1'>
                          <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                          <span className='text-xs font-medium'>
                            {listing.user?.trustRating?.starRating !== undefined
                              ? listing.user.trustRating.starRating.toFixed(1)
                              : listing.business?.trustRating?.averageRating !==
                                  undefined
                                ? listing.business!.trustRating!.averageRating!.toFixed(
                                    1,
                                  )
                                : ''}
                          </span>
                        </div>
                        {(listing.user?.trustRating?.totalReviews ||
                          listing.business?.trustRating?.reviewCount) && (
                          <span
                            className='text-xs text-gray-500'
                            style={
                              cardTextColor
                                ? { color: cardTextColor }
                                : undefined
                            }
                          >
                            (
                            {listing.user?.trustRating?.totalReviews ??
                              listing.business?.trustRating?.reviewCount}{' '}
                            reviews)
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className='flex justify-between'>
                <p
                  className='text-sm text-gray-500 mt-2'
                  style={cardTextColor ? { color: cardTextColor } : undefined}
                >
                  {dayjs(listing.createdAt).format('DD MMM YYYY')}
                </p>
                {listing.nsfwApprovalStatus === 'PENDING' && (
                  <Badge className='text-xs h-6 mt-2 '>Pending</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      {showWishlistHeart && (
        <button
          type='button'
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          disabled={wishlistLoading}
          className={`absolute right-2 z-40 rounded-full p-2 shadow-md shadow-black/20 transition-all duration-200 ease-out disabled:opacity-50 ${
            listing.sold ? 'top-12' : 'top-2'
          } ${
            wishlisted
              ? 'bg-black/80 text-red-400 hover:bg-black/90'
              : 'bg-black/55 text-white hover:bg-black/70'
          } ${wishlistAnimate ? 'animate-heart-pop' : 'hover:scale-105 active:scale-95'}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onWishlistHeartClick?.()
          }}
        >
          <Heart
            className='h-5 w-5'
            fill={wishlisted ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      )}
      {/* Actions Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className='absolute top-2 right-2'
        >
          <button
            className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className='absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10'>
              <button
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  setMenuOpen(false)
                  onEdit?.()
                }}
              >
                Edit
              </button>
              {onBoost && (
                <button
                  className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                  onClick={() => {
                    setMenuOpen(false)
                    onBoost()
                  }}
                >
                  Boost listing
                </button>
              )}
              <button
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  setMenuOpen(false)
                  onMarkAsSold?.()
                }}
              >
                Mark as Sold
              </button>
              <button
                className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  setMenuOpen(false)
                  onDelete?.()
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
