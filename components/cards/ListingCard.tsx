import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import { MoreVertical, ShieldCheck, Star } from 'lucide-react'
import { useState } from 'react'
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
  price: string
  images: string[]
  createdAt: string
  sold?: boolean
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
}: ListingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
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
          className={`border border-secondary p-4 rounded-lg shadow-lg min-h-[300px] cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl hover:opacity-80 hover:scale-[1.02] ${
            listing.sold ? 'opacity-60' : ''
          } ${!primaryColor ? 'bg-componentBackground' : ''}`}
          style={cardStyle}
        >
          {listing.sold && (
            <div className='absolute top-2 left-2 z-10'>
              <Badge className='bg-red-500 text-white'>SOLD</Badge>
            </div>
          )}
          <Image
            src={
              listing.images && listing.images.length > 0
                ? generateImageUrl(listing.images[0])
                : '/logo.png'
            }
            alt={listing.title}
            width={300}
            height={300}
            className='w-full h-40 object-cover rounded-md'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/logo.png'
            }}
          />
          <h2
            className='text-xl font-semibold mt-2 mb-2 line-clamp-2 leading-snug min-h-[3.438rem]'
            style={cardTextColor ? { color: cardTextColor } : undefined}
          >
            {listing.title}
          </h2>
          <p
            className='text-foreground line-clamp-2 min-h-[48px]'
            style={cardTextColor ? { color: cardTextColor } : undefined}
          >
            {listing.description}
          </p>
          <p
            className={`font-bold ${
              listing.sold ? 'text-gray-500 line-through' : 'text-success'
            }`}
            data-testid='listing-price'
          >
            R{listing.price}
          </p>
          <div className='mt-2 space-y-1'>
            {!store && (
              <>
                <div className='flex items-center gap-2'>
                  <p className='text-sm text-gray-500'>
                    {listing.user
                      ? listing.user.username
                      : listing.business?.name || 'Unknown'}
                  </p>
                  {/* Verified badge for individual users (verifiedId) or businesses (verifiedWithThirdParty) */}
                  {(listing.user?.trustRating?.verifiedId ||
                    listing.business?.trustRating?.verifiedWithThirdParty) && (
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
                {/* Only show trust rating if user exists and has trustRating */}
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
                              1
                            )
                          : ''}
                      </span>
                    </div>
                    {(listing.user?.trustRating?.totalReviews ||
                      listing.business?.trustRating?.reviewCount) && (
                      <span
                        className='text-xs text-gray-500'
                        style={
                          cardTextColor ? { color: cardTextColor } : undefined
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
          <p
            className='text-sm text-gray-500 mt-2'
            style={cardTextColor ? { color: cardTextColor } : undefined}
          >
            {dayjs(listing.createdAt).format('DD MMM YYYY')}
          </p>
        </div>
      </Link>
      {/* Actions Menu */}
      {showMenu && (
        <div className='absolute top-2 right-2'>
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
            <div className='absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10'>
              <button
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  setMenuOpen(false)
                  onEdit?.()
                }}
              >
                Edit
              </button>
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
