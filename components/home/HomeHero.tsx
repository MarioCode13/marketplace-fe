'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

export default function HomeHero() {
  const router = useRouter()

  return (
    <section className='relative w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900'>
      {/* Background Circles */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          className='absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20'
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute top-40 right-60 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20'
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute bottom-52 left-60 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20'
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            rotate: [0, -180, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className='absolute h-[calc(100vh-80px)] inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20' />

      {/* Hero Content */}
      <Container className='relative z-10 text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='mb-8'
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='mb-6 flex flex-col items-center gap-3'
        >
          <p className='text-4xl sm:text-4xl text-gray-600 dark:text-gray-300 font-medium'>
            Welcome to
          </p>
          <motion.div
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
            }}
            className='relative'
          >
            <motion.div
              className='absolute inset-0 bg-gradient-to-r   rounded-xl opacity-0 blur-lg'
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 1.2,
                ease: 'easeInOut',
              }}
            />
            <Image
              src={'/DealioFont.png'}
              alt='Dealio'
              width={280}
              height={70}
              priority
              className='relative h-auto w-48 sm:w-64 lg:w-80 object-contain '
            />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'
        >
          South Africa&apos;s trusted marketplace for buying and selling
          secondhand items. Secure, transparent, and built on trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'
        >
          <Button
            onClick={() => router.push('/listings')}
            className='text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            size='lg'
            color='gradient'
            variant='contained'
          >
            <ShoppingBag className='mr-2 w-5 h-5' /> Browse Listings{' '}
            <ArrowRight className='ml-2 w-5 h-5' />
          </Button>
          <Button
            onClick={() => router.push('/sell')}
            className=' text-lg  shadow-lg   hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            size='lg'
            variant='outlined'
            color='gradient'
          >
            <TrendingUp className='mr-2 w-5 h-5' /> Sell an Item
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
