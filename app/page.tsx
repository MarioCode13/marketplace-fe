'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Shield,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  ShoppingBag,
  Heart,
  Zap,
} from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.15 } },
  }

  const features = [
    {
      icon: Shield,
      title: 'Trust Rating System',
      color: 'bg-blue-500',
      text: 'Every user has a verified trust rating based on their transaction history, verification status, and community feedback.',
    },
    {
      icon: Zap,
      title: 'Secure Transactions',
      color: 'bg-green-500',
      text: 'Built-in security measures protect both buyers and sellers, ensuring safe and transparent transactions.',
    },
    {
      icon: Users,
      title: 'Verified Community',
      color: 'bg-purple-500',
      text: 'Join a community of verified users who value transparency, honesty, and fair dealing.',
    },
    {
      icon: Heart,
      title: 'Sustainable Shopping',
      color: 'bg-yellow-500',
      text: "Give items a second life while saving money and reducing waste. It's good for your wallet and the planet.",
    },
    {
      icon: TrendingUp,
      title: 'Great Deals',
      color: 'bg-red-500',
      text: 'Find amazing deals on quality secondhand items or turn your unused items into cash quickly and easily.',
    },
    {
      icon: Star,
      title: 'Quality Assurance',
      color: 'bg-indigo-500',
      text: 'Detailed condition ratings and honest descriptions help you make informed purchasing decisions.',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900'>
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

        <div className='absolute h-[100vh] inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/20' />

        {/* Hero Content */}
        <div className='relative z-10 text-center px-6 max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className='mb-8'
          >
            <motion.div
              className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl'
              whileHover={{ scale: 1.1 }}
              animate={{
                rotate: [0, 5, -5, 0],
                boxShadow: [
                  '0 25px 50px -12px rgba(59,130,246,0.25)',
                  '0 25px 50px -12px rgba(147,51,234,0.25)',
                  '0 25px 50px -12px rgba(59,130,246,0.25)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ShoppingBag className='w-12 h-12 text-white' />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6'
          >
            Welcome to{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Dealio
            </span>
          </motion.h1>

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
              className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
              size='lg'
              variant='gradient'
            >
              <ShoppingBag className='mr-2 w-5 h-5' /> Browse Listings{' '}
              <ArrowRight className='ml-2 w-5 h-5' />
            </Button>
            <Button
              onClick={() => router.push('/sell')}
              className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
              size='lg'
              variant='outline'
            >
              <TrendingUp className='mr-2 w-5 h-5' /> Sell an Item
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='relative w-full z-20 bg-white dark:bg-gray-900 py-20'>
        <div className='max-w-6xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Why Choose Dealio?
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              We&apos;ve built the safest and most transparent marketplace
              experience for South Africans.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true, amount: 0.2 }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:translate-y-4'
                >
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-6`}
                  >
                    <Icon className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    {feature.text}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='relative py-20 bg-gradient-to-r from-slate-800 to-purple-800'>
        <div className='max-w-4xl mx-auto text-center px-6'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Ready to Start Trading?
          </h2>
          <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of South Africans who trust Dealio for their
            secondhand buying and selling needs.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              onClick={() => router.push('/listings')}
              className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
              size='lg'
            >
              <ShoppingBag className='mr-2 w-5 h-5' /> Start Browsing
            </Button>
            <Button
              onClick={() => router.push('/sell')}
              className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
              size='lg'
              variant='outline'
            >
              <TrendingUp className='mr-2 w-5 h-5' /> Start Selling
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
