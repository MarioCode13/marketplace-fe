'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { useRouter } from 'next/navigation'
import { Star, ShoppingBag } from 'lucide-react'

export default function HomeCTA() {
  const router = useRouter()

  return (
    <section className='relative py-20 bg-gradient-to-r from-slate-800 to-purple-800'>
      <Container
        size='4xl'
        className='text-center'
      >
        <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
          Ready to Unlock Your Potential?
        </h2>
        <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
          Choose the perfect plan for your needs and join thousands of South
          Africans who trust Dealio for their marketplace success.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            onClick={() => router.push('/subscriptions')}
            variant={'contained'}
            color='gradient'
            className='px-8 py-4 text-lg font-semibold shadow-lg  hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            size='lg'
          >
            <Star className='mr-2 w-5 h-5' /> View Subscription Plans
          </Button>
          <Button
            onClick={() => router.push('/listings')}
            className='!text-[#e6e1ff] px-8 py-4 text-lg   shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            size='lg'
            variant='outlined'
            color='gradient'
          >
            <ShoppingBag className='mr-2 w-5 h-5' /> Browse Marketplace
          </Button>
        </div>
      </Container>
    </section>
  )
}
