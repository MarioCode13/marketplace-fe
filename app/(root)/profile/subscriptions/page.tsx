'use client'

import { useMutation, useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import {
  CANCEL_SUBSCRIPTION,
  REACTIVATE_SUBSCRIPTION,
} from '@/lib/graphql/mutations/subscriptionMutations'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatEnum } from '@/lib/utils'
import { useState } from 'react'

function formatPeriodEnd(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProfileSubscriptionsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ME, {
    errorPolicy: 'all',
  })
  const { data: businessData, loading: businessLoading } =
    useQuery(GET_MY_BUSINESS)
  const router = useRouter()
  const [actionError, setActionError] = useState<string | null>(null)

  const subscription = data?.me?.subscription
  const userId = data?.me?.id

  const [cancelSubscription, { loading: cancelling }] = useMutation(
    CANCEL_SUBSCRIPTION,
    {
      onCompleted: () => {
        setActionError(null)
        refetch()
      },
      onError: (err) => setActionError(err.message),
    },
  )

  const [reactivateSubscription, { loading: reactivating }] = useMutation(
    REACTIVATE_SUBSCRIPTION,
    {
      onCompleted: () => {
        setActionError(null)
        refetch()
      },
      onError: (err) => setActionError(err.message),
    },
  )

  const business = businessData?.myBusiness
  let canManageSubscription = true
  if (business?.businessUsers?.length) {
    canManageSubscription = false
    const businessUser = business.businessUsers.find(
      (bu: { user: { id: string }; role: string }) => bu.user.id === userId,
    )
    if (
      businessUser &&
      (businessUser.role === 'OWNER' || businessUser.role === 'MANAGER')
    ) {
      canManageSubscription = true
    }
  }

  const pendingCancel = subscription?.cancelAtPeriodEnd === true
  const actionLoading = cancelling || reactivating

  const handleCancel = async () => {
    if (
      !window.confirm(
        'Cancel your subscription? You will keep access until the end of the current billing period, and PayFast will stop charging you after that.',
      )
    ) {
      return
    }
    setActionError(null)
    await cancelSubscription()
  }

  const handleReactivate = async () => {
    setActionError(null)
    await reactivateSubscription()
  }

  if (loading || businessLoading) {
    return <div className='p-6'>Loading subscription details...</div>
  }
  if (error) {
    return <div className='p-6'>Error loading subscription details.</div>
  }

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
      <h2 className='text-2xl font-bold mb-2'>Manage Subscription</h2>
      <div className='mb-4 space-y-1 text-sm'>
        <div>
          <strong>Plan:</strong> {formatEnum(subscription.planType ?? '')}
        </div>
        <div>
          <strong>Status:</strong> {formatEnum(subscription.status ?? '')}
        </div>
        {subscription.amount != null && (
          <div>
            <strong>Amount:</strong> R{Number(subscription.amount).toFixed(2)}{' '}
            / {formatEnum(subscription.billingCycle ?? 'monthly')}
          </div>
        )}
        <div>
          <strong>Current period ends:</strong>{' '}
          {formatPeriodEnd(subscription.currentPeriodEnd)}
        </div>
        {pendingCancel && (
          <p className='text-amber-600 dark:text-amber-400 pt-2'>
            Cancellation scheduled. You keep access until{' '}
            {formatPeriodEnd(subscription.currentPeriodEnd)}. PayFast will not
            charge you again after that.
          </p>
        )}
      </div>

      {actionError && (
        <p className='text-red-600 text-sm mb-3' role='alert'>
          {actionError}
        </p>
      )}

      <div className='flex flex-wrap gap-2'>
        {pendingCancel ? (
          <Button
            onClick={handleReactivate}
            disabled={!canManageSubscription || actionLoading}
          >
            {reactivating ? 'Reactivating…' : 'Keep Subscription'}
          </Button>
        ) : (
          <Button
            variant='outlined'
            onClick={handleCancel}
            disabled={!canManageSubscription || actionLoading}
          >
            {cancelling ? 'Cancelling…' : 'Cancel Subscription'}
          </Button>
        )}
        <Button
          onClick={() => router.push('/subscriptions')}
          disabled={!canManageSubscription}
        >
          Change Plan
        </Button>
      </div>

      {!canManageSubscription && (
        <p className='text-xs text-gray-500 mt-2'>
          Only the business owner or manager can manage the subscription.
        </p>
      )}
    </div>
  )
}
