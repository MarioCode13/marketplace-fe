'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GET_NOTIFICATIONS } from '@/lib/graphql/queries/getNotifications'
import {
  MARK_NOTIFICATION_READ,
  ACCEPT_BUSINESS_INVITATION,
  DECLINE_BUSINESS_INVITATION,
} from '@/lib/graphql/mutations/notificationMutations'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Check, CheckCircle, XCircle, Clock, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  message: string
  type: string
  read: boolean
  actionRequired: boolean
  data?: string
  createdAt: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const userContext = useSelector((state: RootState) => state.userContext)
  const userId = userContext.userId

  const { data: meData } = useQuery(GET_ME)

  const {
    data: notificationsData,
    loading,
    refetch,
  } = useQuery(GET_NOTIFICATIONS, {
    variables: { userId: meData?.me?.id },
    skip: !userId || !meData?.me?.id,
    fetchPolicy: 'cache-and-network',
  })

  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => {
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read: ' + error.message)
    },
  })

  const [acceptInvitation] = useMutation(ACCEPT_BUSINESS_INVITATION, {
    onCompleted: () => {
      toast.success('Business invitation accepted!')
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to accept invitation: ' + error.message)
    },
  })

  const [declineInvitation] = useMutation(DECLINE_BUSINESS_INVITATION, {
    onCompleted: () => {
      toast.success('Business invitation declined')
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to decline invitation: ' + error.message)
    },
  })

  if (!userId) {
    router.push('/login')
    return null
  }

  const notifications: Notification[] = notificationsData?.notifications || []
  const unreadCount = notifications.filter((n: Notification) => !n.read).length

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (n: Notification) => !n.read
    )

    try {
      await Promise.all(
        unreadNotifications.map((notification: Notification) =>
          markAsRead({ variables: { notificationId: notification.id } })
        )
      )
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error(
        'Failed to mark all notifications as read: ' + (error as Error).message
      )
    }
  }

  const handleAcceptInvitation = async (notificationId: string) => {
    setProcessingId(notificationId)
    try {
      await acceptInvitation({ variables: { notificationId } })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDeclineInvitation = async (notificationId: string) => {
    setProcessingId(notificationId)
    try {
      await declineInvitation({ variables: { notificationId } })
    } finally {
      setProcessingId(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BUSINESS_INVITATION':
        return <Users className='w-5 h-5 text-blue-500' />
      case 'SYSTEM':
        return <Bell className='w-5 h-5 text-gray-500' />
      default:
        return <Bell className='w-5 h-5 text-gray-500' />
    }
  }

  const isBusinessInvitation = (type: string) => type === 'BUSINESS_INVITATION'

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <Bell className='w-8 h-8 text-blue-500' />
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Notifications
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : 'All caught up!'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant='outlined'
              className='flex items-center gap-2'
            >
              <Check className='w-4 h-4' />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className='p-6'
              >
                <div className='animate-pulse'>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                </div>
              </Card>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card className='p-12 text-center'>
            <Bell className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
              No notifications yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              When you receive notifications, they&apos;ll appear here.
            </p>
          </Card>
        ) : (
          <div className='space-y-4'>
            {notifications.map((notification: Notification) => (
              <Card
                key={notification.id}
                className={`p-6 transition-all duration-200 hover:shadow-md ${
                  !notification.read
                    ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    : ''
                }`}
              >
                <div className='flex items-start gap-4'>
                  {/* Icon */}
                  <div className='flex-shrink-0 mt-1'>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <p className='text-gray-900 dark:text-white font-medium'>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <Badge
                              variant='secondary'
                              className='text-xs'
                            >
                              New
                            </Badge>
                          )}
                          {notification.actionRequired && (
                            <Badge
                              variant='destructive'
                              className='text-xs'
                            >
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                          <Clock className='w-3 h-3' />
                          {formatTimeAgo(notification.createdAt)}
                        </div>
                      </div>

                      {/* Mark as read button */}
                      {!notification.read && (
                        <Button
                          variant='text'
                          size='sm'
                          onClick={() =>
                            markAsRead({
                              variables: { notificationId: notification.id },
                            })
                          }
                          className='flex-shrink-0'
                        >
                          <Check className='w-4 h-4' />
                        </Button>
                      )}
                    </div>

                    {/* Action buttons for business invitations */}
                    {notification.actionRequired &&
                      isBusinessInvitation(notification.type) && (
                        <div className='flex gap-2 mt-4'>
                          <Button
                            onClick={() =>
                              handleAcceptInvitation(notification.id)
                            }
                            disabled={processingId === notification.id}
                            className='flex items-center gap-2'
                            size='sm'
                          >
                            <CheckCircle className='w-4 h-4' />
                            {processingId === notification.id
                              ? 'Processing...'
                              : 'Accept'}
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeclineInvitation(notification.id)
                            }
                            disabled={processingId === notification.id}
                            variant='outlined'
                            className='flex items-center gap-2'
                            size='sm'
                          >
                            <XCircle className='w-4 h-4' />
                            Decline
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
