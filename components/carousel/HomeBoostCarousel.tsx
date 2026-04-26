'use client'

import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
} from 'framer-motion'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BOOSTED_HOME_LISTINGS } from '@/lib/graphql/queries/boostedHomeListings'
import { generateImageUrl } from '@/lib/utils'

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

export default function HomeBoostCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [containerWidth, setContainerWidth] = useState(0)

  const { data, loading, error } = useQuery(BOOSTED_HOME_LISTINGS, {
    variables: { limit: 16 },
    fetchPolicy: 'cache-and-network',
    skip: !isInView, // Lazy load: only fetch when in view
  })

  const listings: BoostedListing[] = useMemo(
    () => data?.boostedHomeListings ?? [],
    [data],
  )

  // Stable shuffle (avoid reshuffling on unrelated re-renders)
  const shuffleSeedRef = useRef<number | null>(null)
  if (shuffleSeedRef.current == null) {
    shuffleSeedRef.current = Math.floor(Math.random() * 1_000_000_000)
  }
  const listingsKey = useMemo(() => listings.map((l) => l.id).join(','), [listings])

  const [shuffledListings, setShuffledListings] = useState<BoostedListing[]>([])

  useEffect(() => {
    if (listings.length <= 1) {
      setShuffledListings(listings)
      return
    }

    const mulberry32 = (seed: number) => () => {
      let t = (seed += 0x6d2b79f5)
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    const rand = mulberry32(shuffleSeedRef.current!)
    const shuffled = [...listings]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setShuffledListings(shuffled)
  }, [listingsKey, listings])

  // Duplicate shuffled listings for infinite loop
  const ITEM_PITCH_PX = 276 // 260px width + 16px gap (gap-4)
  const baseSetWidth = shuffledListings.length * ITEM_PITCH_PX

  // Ensure the track is long enough to avoid blank trailing space.
  // Rule: at least (containerWidth + one full base set) of content.
  const repeatedListings = useMemo(() => {
    if (shuffledListings.length === 0) return []
    if (shuffledListings.length === 1) return [...shuffledListings]

    const targetWidth = Math.max(containerWidth + baseSetWidth, baseSetWidth * 2)
    const minRepeats = Math.max(2, Math.ceil(targetWidth / baseSetWidth))
    const out: BoostedListing[] = []
    for (let i = 0; i < minRepeats; i++) {
      out.push(...shuffledListings)
    }
    return out
  }, [baseSetWidth, containerWidth, shuffledListings])

  // Marquee motion (no visible reset/jump)
  const x = useMotionValue(0)
  const speedPxPerSecond = 36

  const wrap = (min: number, max: number, v: number) => {
    const range = max - min
    if (range === 0) return min
    return ((((v - min) % range) + range) % range) + min
  }

  useEffect(() => {
    // Reset when data changes so it doesn't "snap" mid-track
    x.set(0)
  }, [baseSetWidth, x])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 0
      setContainerWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (!isInView || loading) return
    if (shuffledListings.length <= 1) return
    if (baseSetWidth <= 0) return

    const moveBy = (speedPxPerSecond * delta) / 1000
    const next = x.get() - moveBy
    // Keep x in [-baseSetWidth, 0) so the duplicated track always covers viewport
    x.set(wrap(-baseSetWidth, 0, next))
  })

  if (loading && listings.length === 0) {
    return (
      <section className='relative z-20 w-full bg-gradient-to-b from-white to-blue-50/40 dark:from-gray-900 dark:to-gray-950 border-y border-blue-100/80 dark:border-gray-800 py-10'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6' />
          <div className='flex gap-4 overflow-hidden'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='flex-none w-[260px] h-[200px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse'
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return null
  }

  return (
    <div ref={ref} className='w-full'>
      {isInView &&
        (loading ? (
          <div className='w-full overflow-hidden min-h-[220px]'>
            {' '}
            {/* Min height to prevent CLS, taller for safety */}
            <div className='flex gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='flex-none w-[260px] h-[200px] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse'
                />
              ))}
            </div>
          </div>
        ) : listings.length > 0 ? (
          <div className='w-full overflow-hidden min-h-[220px]'>
            {' '}
            {/* Min height to prevent CLS, taller for safety */}
            <motion.div
              className='flex gap-4'
              style={{
                x: shuffledListings.length > 1 ? x : 0,
                width: `${repeatedListings.length * ITEM_PITCH_PX}px`,
              }}
            >
              {repeatedListings.map((listing, index) => {
                const seller =
                  listing.business?.name || listing.user?.username || 'Seller'
                const place = listing.city?.name || listing.customCity || ''
                return (
                  <Link
                    key={`${listing.id}-${index}`}
                    href={`/listing/${listing.id}`}
                    className='flex-none w-[260px] group'
                  >
                    <motion.div
                      className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col'
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
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
                    </motion.div>
                  </Link>
                )
              })}
            </motion.div>
          </div>
        ) : null)}
    </div>
  )
}
