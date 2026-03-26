'use client'

import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
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

  const { data, loading, error } = useQuery(BOOSTED_HOME_LISTINGS, {
    variables: { limit: 16 },
    fetchPolicy: 'cache-and-network',
    skip: !isInView, // Lazy load: only fetch when in view
  })

  const listings: BoostedListing[] = useMemo(
    () => data?.boostedHomeListings ?? [],
    [data],
  )

  // Shuffle listings for random order
  const shuffledListings = useMemo(() => {
    const shuffled = [...listings]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [listings])

  // Duplicate shuffled listings for infinite loop
  const duplicatedListings = [...shuffledListings, ...shuffledListings]

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
    <div ref={ref}>
      {isInView &&
        (loading ? (
          <div className='overflow-hidden min-h-[220px]'>
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
          <div className='overflow-hidden min-h-[220px]'>
            {' '}
            {/* Min height to prevent CLS, taller for safety */}
            <motion.div
              className='flex gap-4'
              animate={{
                x: [0, -264 * shuffledListings.length], // 260px width + 4px gap
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: shuffledListings.length * 5, // Constant speed: 5 seconds per full set
                  ease: 'linear',
                },
              }}
              style={{ width: `${duplicatedListings.length * 264}px` }}
            >
              {duplicatedListings.map((listing, index) => {
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
