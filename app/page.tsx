import { Metadata } from 'next'
import HomeHero from '@/components/home/HomeHero'
import HomeBoostCarousel from '@/components/carousel/HomeBoostCarousel'
import HomeFeatures from '@/components/home/HomeFeatures'
import HomeCTA from '@/components/home/HomeCTA'

export const metadata: Metadata = {
  title: 'Dealio - South Africa\'s Trusted Marketplace',
  description:
    'South Africa\'s trusted marketplace for buying and selling secondhand items. Secure, transparent, and built on trust.',
  openGraph: {
    title: 'Dealio - South Africa\'s Trusted Marketplace',
    description:
      'South Africa\'s trusted marketplace for buying and selling secondhand items. Secure, transparent, and built on trust.',
    url: 'https://dealio.org.za',
    images: [
      {
        url: 'https://dealio.org.za/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dealio - South Africa\'s Trusted Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dealio - South Africa\'s Trusted Marketplace',
    description:
      'South Africa\'s trusted marketplace for buying and selling secondhand items. Secure, transparent, and built on trust.',
    images: ['https://dealio.org.za/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <>
      <HomeHero />
      <section className='relative z-20 w-full bg-gradient-to-b from-white to-blue-50/40 dark:from-gray-900 dark:to-gray-950 border-y border-blue-100/80 dark:border-gray-800 py-10'>
        <HomeBoostCarousel />
      </section>
      <HomeFeatures />
      <HomeCTA />
    </>
  )
}
