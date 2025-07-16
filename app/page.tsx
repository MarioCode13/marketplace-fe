'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <section className='relative w-full flex flex-col items-center'>
        <div className='relative w-full'>
          <Image
            src='/marketplace-banner2.jpg'
            alt='Marketplace Banner'
            width={1500}
            height={1500}
            className='shadow-lg object-cover object-center w-full h-64 sm:h-[30rem] [filter:hue-rotate(330deg)]'
            priority
          />
          <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-center px-4 py-8'>
            <h1 className='text-3xl sm:text-5xl font-bold text-white drop-shadow-lg text-center'>
              Buy & Sell with Confidence
            </h1>
            <p className='mt-3 text-gray-200 text-lg max-w-2xl drop-shadow-md text-center'>
              A hassle-free marketplace for secondhand items. Secure,
              transparent, and built on trust.
            </p>
          </div>
        </div>
      </section>
      <div className='min-h-[60vh] flex flex-col items-center text-center'>
        <section className='mt-16 max-w-4xl text-left px-6 sm:px-0'>
          <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>
            Why Choose Our Marketplace?
          </h2>
          <p className='mt-3 text-gray-600 dark:text-gray-300 leading-relaxed'>
            The secondhand market should be **safe and stress-free**.
            That&apos;s why we&apos;re introducing a{' '}
            <span className='font-semibold text-blue-500 text-lg'>
              Trust Rating System
            </span>
            , ensuring that buyers and sellers have{' '}
            <span className='text-green-500 font-medium'>
              verified reputations
            </span>
            .
            <br />
            <br />
            ✅ **No more scams** — just fair deals.
            <br />
            ✅ **Seller Transparency** — know who you’re buying from.
            <br />✅ **Secure Transactions** — peace of mind when shopping.
          </p>
        </section>

        {/* Call to Action */}
        <section className='mt-12 flex flex-col items-center gap-4'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Start Exploring Now!
          </h2>
          <div className='flex gap-4 mb-8 w-full max-w-md'>
            <Button
              type='submit'
              variant={'default'}
              className='w-full'
              size='xl'
              onClick={() => router.push('/listings')}
            >
              Browse Listings
            </Button>

            <Button
              type='button'
              variant='secondary'
              className='w-full'
              size='xl'
              onClick={() => router.push('/sell')}
            >
              Sell an Item
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
