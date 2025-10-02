'use client'

import { useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ProfileSubscriptionsPage() {
  const { data, loading, error } = useQuery(GET_ME)
  const { data: businessData, loading: businessLoading } =
    useQuery(GET_MY_BUSINESS)
  const router = useRouter()
  const subscription = data?.me?.subscription
  const userId = data?.me?.id

  // Check if user is OWNER or MANAGER of business
  let canManageSubscription = false
  const business = businessData?.myBusiness
  if (business && business.businessUsers) {
    interface BusinessUser {
      user: {
        id: string
      }
      role: 'OWNER' | 'MANAGER' | string
    }

    interface Business {
      businessUsers: BusinessUser[]
    }

    const businessUser = (business as Business).businessUsers.find(
      (bu: BusinessUser) => bu.user.id === userId
    )
    if (
      businessUser &&
      (businessUser.role === 'OWNER' || businessUser.role === 'MANAGER')
    ) {
      canManageSubscription = true
    }
  }

  if (loading || businessLoading)
    return <div>Loading subscription details...</div>
  if (error) return <div>Error loading subscription details.</div>

  if (!subscription) {
    return (
      <div className='max-w-md mx-auto mt-10 p-6 bg-componentBackground rounded-lg shadow'>
        <h2 className='text-2xl font-bold mb-2'>No Active Subscription</h2>
        <p className='mb-4'>
          You do not have an active subscription. Upgrade to unlock more
          features!
        </p>
        <Button onClick={() => router.push('/subscriptions')}>
          View Plans
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-componentBackground rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-2'>Subscription Details</h2>
      <div className='mb-4'>
        <div>
          <strong>Plan:</strong> {subscription.planType}
        </div>
        <div>
          <strong>Status:</strong> {subscription.status}
        </div>
        {/* Add more details like valid until, renewal, etc. if available */}
      </div>
      <div className='flex gap-2'>
        <Button
          variant='outlined'
          onClick={() => {
            /* TODO: Cancel logic */
          }}
          disabled={!canManageSubscription}
        >
          Cancel Subscription
        </Button>
        <Button
          onClick={() => router.push('/subscriptions')}
          disabled={!canManageSubscription}
        >
          Upgrade
        </Button>
      </div>
      {!canManageSubscription && (
        <div className='text-xs text-gray-500 mt-2'>
          Only the business owner or manager can manage the subscription.
        </div>
      )}
    </div>
  )
}
