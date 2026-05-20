'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/button'
import ListingCard, { CardListing } from '@/components/cards/ListingCard'
import { ListFilter, ShieldCheck, Star } from 'lucide-react'

const demoListings: CardListing[] = [
  {
    id: 'demo-1',
    title: 'Summit Trail Jacket',
    description: 'Waterproof, breathable, and ready for every mountain path.',
    price: '450',
    images: [
      'https://images.unsplash.com/photo-1543274747-e969ff86c466?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    createdAt: '2026-05-10T12:00:00.000Z',
    sold: false,
    user: {
      id: 'demo-user-1',
      username: 'SummitAdmin',
      trustRating: {
        overallScore: 4.9,
        starRating: 4.9,
        totalReviews: 128,
        verifiedId: true,
      },
    },
  },
  {
    id: 'demo-2',
    title: 'Everest Hiking Boots',
    description: 'Built for rough trails with premium comfort and traction.',
    price: '320',
    images: [
      'https://images.unsplash.com/photo-1575987116913-e96e7d490b8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    createdAt: '2026-05-08T08:30:00.000Z',
    sold: false,
    user: {
      id: 'demo-user-2',
      username: 'SummitAdmin',
      trustRating: {
        overallScore: 4.8,
        starRating: 4.8,
        totalReviews: 89,
        verifiedId: true,
      },
    },
  },
  {
    id: 'demo-3',
    title: 'Altitude Camping Stove',
    description:
      'Fast boil time, compact carry case, and reliable flame control.',
    price: '180',
    images: [
      'https://images.unsplash.com/photo-1522041350204-22285237eeca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    createdAt: '2026-05-06T15:20:00.000Z',
    sold: false,
    user: {
      id: 'demo-user-3',
      username: 'SummitAdmin',
      trustRating: {
        overallScore: 4.9,
        starRating: 4.9,
        totalReviews: 74,
        verifiedId: true,
      },
    },
  },
  {
    id: 'demo-4',
    title: 'Nomad Explorer Backpack',
    description:
      'Large capacity, ergonomic support, and premium weather resistance.',
    price: '520',
    images: [
      'https://images.unsplash.com/photo-1622260614927-208cfe3f5cfd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    createdAt: '2026-05-04T10:10:00.000Z',
    sold: false,
    user: {
      id: 'demo-user-4',
      username: 'SummitAdmin',
      trustRating: {
        overallScore: 4.7,
        starRating: 4.7,
        totalReviews: 102,
        verifiedId: true,
      },
    },
  },
]

const demoStore = {
  bannerGradient: 'from-slate-950 via-slate-900 to-blue-950',
  about:
    'High-performance outdoor gear for serious adventurers and weekend explorers. All product pages are optimized for discovery, trust, and rich storefront presentation.',
  listings: 28,
  trust: '4.9',
}

export default function DemoStorePage() {
  const trustRating = 4.9
  const storeName = 'Summit Gear Co.'
  const badgeLabel = 'PRO_STORE'

  return (
    <div className='min-h-screen w-full bg-slate-50 dark:bg-slate-950 py-12 px-4'>
      <Container className='p-4'>
        <div className='mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.32em] text-blue-600 dark:text-blue-400'>
              Pro Store preview
            </p>
            <p className='mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300'>
              This demo mirrors the Pro Store layout and features, showcasing
              how your store could look with enhanced branding, trust signals,
              and optimised listing presentation. All content is for
              demonstration purposes only.
            </p>
          </div>
          <Link
            href='/subscriptions'
            className='text-sm font-semibold text-blue-600   dark:text-blue-300'
          >
            Back to pricing
          </Link>
        </div>

        <div className='rounded-[2rem] border border-slate-200  bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top,_#16a34a_0%,_#14532d_55%,_#0b1f14_100%)] dark:shadow-black/20'>
          <div className='h-72 w-[100vw] max-w-[100%] overflow-hidden mb-6'>
            <div
              className='h-full w-full bg-cover bg-center rounded-tl-[2rem] rounded-tr-[2rem]'
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              }}
            />
          </div>
          <div className='p-8 '>
            <div className='flex items-center gap-4 mb-4 '>
              <div
                className='h-24  w-24 rounded-full border border-slate-200 bg-slate-900 dark:border-slate-700'
                style={{
                  backgroundImage:
                    "url('https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_750,h_400/https://assets.designhill.com/design-blog/wp-content/uploads/2014/12/1-min-4.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className='flex-1'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {storeName}
                    </h1>
                    <ShieldCheck className='w-4 h-4 text-blue-600' />
                  </div>
                </div>
                <p className='mt-2 text-slate-600 dark:text-slate-300'>
                  {demoStore.about}
                </p>
                <div className='mt-3 flex items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${index < Math.floor(trustRating) ? 'text-yellow-400 fill-yellow-400 stroke-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className='text-xs px-2 py-1 rounded bg-blue-600 text-white'>
                    {badgeLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-8'>
              <div className='flex items-center justify-start w-full mb-6'>
                <Button
                  variant='outlined'
                  size='icon'
                  className='rounded-full p-3'
                >
                  <ListFilter className='!w-5 !h-5' />
                </Button>
              </div>

              <div className='w-full mb-4 text-sm text-slate-600 dark:text-slate-300'>
                {demoListings.length} listings found
              </div>
            </div>
          </div>

          <div className='border-t border-slate-200 px-8 py-6 dark:border-slate-800'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {demoListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  primaryColor='rgb(15, 48, 22)'
                  cardTextColor='#fff'
                  store
                  clickable={false}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
