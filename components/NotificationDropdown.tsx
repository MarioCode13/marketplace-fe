'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Bell, Check, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { GET_NOTIFICATIONS } from '@/lib/graphql/queries/getNotifications'
import { MARK_NOTIFICATION_READ } from '@/lib/graphql/mutations/notificationMutations'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import Link from 'next/link'
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

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useSelector((state: RootState) => state.userContext)
  const router = useRouter()
  const { data: meData } = useQuery(GET_ME, {
    skip: !user,
    fetchPolicy: 'cache-first',
  })

  const {
    data: notificationsData,
    loading,
    refetch,
  } = useQuery(GET_NOTIFICATIONS, {
    variables: { userId: meData?.me?.id },
    skip: !user || !meData?.me?.id,
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // Poll every 30 seconds
  })

  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => {
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read : ' + error.message)
    },
  })

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
        'Failed to mark all notifications as read' +
          (error instanceof Error ? error.message : '')
      )
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (!user) return null

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='outlined'
          size='icon'
          className='relative rounded-full w-12 h-12'
        >
          <Bell className='w-5 h-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-80 max-h-96 overflow-y-auto'
      >
        <div className='flex items-center justify-between p-3 border-b'>
          <h3 className='font-semibold'>Notifications</h3>

          <Button
            variant='text'
            size='sm'
            asChild
            className='text-xs'
          >
            <Link
              href='/notifications'
              onClick={() => setIsOpen(false)}
            >
              <Eye className='w-3 h-3 mr-1' />
              View all
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className='p-4 text-center text-gray-500'>Loading...</div>
        ) : notifications.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>No notifications</div>
        ) : (
          <div className='max-h-64 overflow-y-auto'>
            {unreadCount > 0 && (
              <div className='flex justify-end  mt-2'>
                <Button
                  variant='text'
                  size='sm'
                  onClick={handleMarkAllAsRead}
                  className='text-xs'
                >
                  <Check className='w-3 h-3 mr-1' />
                  Mark all read
                </Button>
              </div>
            )}
            {notifications.slice(0, 5).map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead({
                      variables: { notificationId: notification.id },
                    })
                  }
                  if (notification.actionRequired) {
                    setIsOpen(false)
                    // Navigate to notifications page for actions
                    router.push('/notifications')
                  }
                }}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {notification.message}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                    {notification.actionRequired && (
                      <p className='text-xs text-blue-600 dark:text-blue-400 mt-1'>
                        Action required
                      </p>
                    )}
                  </div>
                  {!notification.read && (
                    <div className='w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0' />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <div className='p-2'>
              <Button
                variant='text'
                size='sm'
                asChild
                className='w-full text-sm'
              >
                <Link
                  href='/notifications'
                  onClick={() => setIsOpen(false)}
                >
                  View all {notifications.length} notifications
                </Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
