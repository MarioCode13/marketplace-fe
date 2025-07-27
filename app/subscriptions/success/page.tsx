'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useMeQuery } from '@/lib/graphql/generated'

export default function SubscriptionSuccess() {
  const [status, setStatus] = useState<'pending' | 'active' | 'error'>(
    'pending'
  )
  const { data, startPolling, stopPolling } = useMeQuery({
    pollInterval: 2000,
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    let attempts = 0
    if (!data) return
    if (data.me?.subscription?.status === 'ACTIVE' || data.me?.subscription?.status === 'TRIAL') {
      setStatus('active')
      stopPolling()
    } else {
      startPolling(2000)
      const interval = setInterval(() => {
        attempts++
        if (data.me?.subscription?.status === 'ACTIVE' || data.me?.subscription?.status === 'TRIAL') {
          setStatus('active')
          stopPolling()
          clearInterval(interval)
        } else if (attempts >= 10) {
          setStatus('error')
          stopPolling()
          clearInterval(interval)
        }
      }, 2000)
      return () => {
        stopPolling()
        clearInterval(interval)
      }
    }
  }, [data, startPolling, stopPolling])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center'>
        {status === 'pending' && (
          <>
            <h1 className='text-3xl font-bold text-green-600 dark:text-green-400 mb-4'>
              Payment Successful!
            </h1>
            <p className='text-lg text-gray-700 dark:text-gray-200 mb-6'>
              Confirming your subscription...
            </p>
          </>
        )}
        {status === 'active' && (
          <>
            <h1 className='text-3xl font-bold text-green-600 dark:text-green-400 mb-4'>
              Subscription Active!
            </h1>
            <p className='text-lg text-gray-700 dark:text-gray-200 mb-6'>
              Thank you for subscribing. Your subscription is now active.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className='text-3xl font-bold text-red-600 dark:text-red-400 mb-4'>
              Could not confirm subscription
            </h1>
            <p className='text-lg text-gray-700 dark:text-gray-200 mb-6'>
              Please check your account or contact support if your subscription
              does not activate soon.
            </p>
          </>
        )}
        <Link href='/subscriptions'>
          <Button>Back to Subscriptions</Button>
        </Link>
      </div>
    </div>
  )
}
