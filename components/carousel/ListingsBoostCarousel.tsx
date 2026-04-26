'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import { BOOSTED_HOME_LISTINGS } from '@/lib/graphql/queries/boostedHomeListings'
import { generateImageUrl } from '@/lib/utils'

type MarqueeVars = React.CSSProperties & {
  ['--dealio-marquee-base-width']?: string
  ['--dealio-marquee-duration']?: string
}

type BoostedListing = {
  id: string
  title: string
  images: string[]
  price: number
  user?: { username: string } | null
  business?: { name: string } | null
  city?: { name: string } | null
  customCity?: string | null
}

export default function ListingsBoostCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [repeatCount, setRepeatCount] = useState(2)

  const { data, loading, error } = useQuery(BOOSTED_HOME_LISTINGS, {
    variables: { limit: 16 },
    fetchPolicy: 'cache-first',
  })

  const listings: BoostedListing[] = useMemo(
    () => data?.boostedHomeListings ?? [],
    [data],
  )

  const ITEM_PITCH_PX = 276 // 260px + gap-4
  const baseSetWidth = listings.length * ITEM_PITCH_PX

  const listingsKey = useMemo(() => listings.map((l) => l.id).join(','), [listings])

  useEffect(() => {
    if (listings.length <= 1) {
      setRepeatCount(1)
      return
    }
    if (baseSetWidth <= 0) {
      setRepeatCount(2)
      return
    }

    // Compute once per listings set (avoid continuous resize-driven DOM changes which restart CSS animations).
    const viewportWidth =
      typeof window !== 'undefined'
        ? window.innerWidth
        : containerRef.current?.getBoundingClientRect().width || 0

    // Need enough total width so that after shifting by one base set width,
    // the remaining track still covers the viewport.
    const needed = Math.max(viewportWidth + baseSetWidth, baseSetWidth * 2)
    const repeats = Math.max(2, Math.ceil(needed / baseSetWidth))
    setRepeatCount(repeats)
  }, [baseSetWidth, listingsKey, listings.length])

  // Ensure the track is long enough to avoid trailing empty space.
  // Animation distance stays one base set width, but the rendered track must cover the viewport at all times.
  const repeated = useMemo(() => {
    if (listings.length === 0) return []
    if (listings.length === 1) return [...listings]
    const out: BoostedListing[] = []
    for (let i = 0; i < repeatCount; i++) {
      out.push(...listings)
    }
    return out
  }, [listings, repeatCount])

  if (error) return null
  if (loading && listings.length === 0) return null
  if (listings.length === 0) return null

  return (
    <div ref={containerRef} className='w-full overflow-hidden'>
      <div
        className={listings.length > 1 ? 'dealio-marquee-track flex gap-4' : 'flex gap-4'}
        style={
          listings.length > 1
            ? ({
                ['--dealio-marquee-base-width']: `${baseSetWidth}px`,
                ['--dealio-marquee-duration']: `${Math.max(
                  24,
                  listings.length * 6,
                )}s`,
              } as MarqueeVars)
            : undefined
      }
      >
        {repeated.map((listing, index) => {
          const seller =
            listing.business?.name || listing.user?.username || 'Seller'
          const place = listing.city?.name || listing.customCity || ''
          return (
            <Link
              key={`${listing.id}-${index}`}
              href={`/listing/${listing.id}`}
              className='flex-none w-[260px] group'
            >
              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col'>
                <div className='relative w-full h-36 bg-gray-100 dark:bg-gray-800'>
                  <Image
                    src={
                      listing.images?.length
                        ? generateImageUrl(listing.images[0])
                        : '/logo.png'
                    }
                    alt={listing.title}
                    fill
                    className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
                    sizes='260px'
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.src = '/logo.png'
                    }}
                  />
                </div>
                <div className='p-3 flex flex-col flex-1'>
                  <h3 className='font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug mb-1'>
                    {listing.title}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2'>
                    {seller}
                    {place ? ` · ${place}` : ''}
                  </p>
                  <p className='mt-auto text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                    R{Number(listing.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

