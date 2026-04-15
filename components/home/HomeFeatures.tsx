'use client'

import { Container } from '@/components/ui/Container'
import { motion } from 'framer-motion'
import {
  Shield,
  Users,
  TrendingUp,
  Star,
  Heart,
  Zap,
} from 'lucide-react'

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

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } },
}

export default function HomeFeatures() {
  return (
    <section className='relative w-full z-20 bg-white dark:bg-gray-900 py-20'>
      <Container>
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
      </Container>
    </section>
  )
}
