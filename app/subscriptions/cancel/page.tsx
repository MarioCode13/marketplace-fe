import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SubscriptionCancel() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-red-600 dark:text-red-400 mb-4'>Payment Cancelled</h1>
        <p className='text-lg text-gray-700 dark:text-gray-200 mb-6'>
          Your payment was cancelled. No changes have been made to your subscription.
        </p>
        <Link href='/subscriptions'>
          <Button>Back to Subscriptions</Button>
        </Link>
      </div>
    </div>
  )
} 