'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PENDING_APPROVALS } from '@/lib/graphql/queries/getPendingApprovals'
import {
  APPROVE_LISTING,
  DECLINE_LISTING,
} from '@/lib/graphql/mutations/adminApprovalMutations'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { generateImageUrl } from '@/lib/utils'
import { RootState } from '@/store/store'

interface ApprovalItem {
  id: string
  flagType: string
  status: string
  approvalNotes?: string | null
  createdAt: string
  listing: {
    id: string
    title: string
    nsfwFlagged: boolean
    nsfwApprovalStatus?: string | null
    images: string[]
    business?: {
      id: string
      slug?: string | null
      name: string
    } | null
    user?: {
      id: string
      firstName?: string | null
      lastName?: string | null
      username: string
    } | null
  }
}

interface NsfwContentPage {
  items: ApprovalItem[]
  totalCount: number
  pageNumber: number
  pageSize: number
  hasNextPage: boolean
}

interface GetPendingApprovalsData {
  getPendingApprovals: NsfwContentPage
}

export default function AdminApprovalsPage() {
  const router = useRouter()
  const { userId, role } = useSelector((state: RootState) => state.userContext)

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (userId === null) {
      // User not logged in, redirect to login
      router.push('/login')
    } else if (role !== 'ADMIN') {
      // User logged in but not admin, redirect to home
      router.push('/')
    }
  }, [userId, role, router])

  const [page, setPage] = useState(0)
  const pageSize = 10

  const { data, loading, error, refetch } = useQuery<GetPendingApprovalsData>(
    GET_PENDING_APPROVALS,
    {
      variables: { page, size: pageSize },
      fetchPolicy: 'network-only',
    },
  )

  const [approveListing, { loading: approving }] = useMutation(APPROVE_LISTING)
  const [declineListing, { loading: declining }] = useMutation(DECLINE_LISTING)

  // Don't render anything if not authorized
  if (!userId || role !== 'ADMIN') {
    return (
      <Container className='py-8'>
        <div className='text-center py-16 text-muted-foreground'>
          Checking permissions...
        </div>
      </Container>
    )
  }

  const handleApprove = async (id: string) => {
    try {
      await approveListing({
        variables: {
          approvalQueueId: id,
          approvalNotes: 'Approved via admin UI',
        },
      })
      toast.success('Listing approved')
      await refetch()
    } catch (err) {
      toast.error(
        'Failed to approve listing: ' +
          (err instanceof Error ? err.message : ''),
      )
    }
  }

  const handleDecline = async (id: string) => {
    try {
      await declineListing({
        variables: {
          approvalQueueId: id,
          declineReason: 'Declined via admin UI',
        },
      })
      toast.success('Listing declined')
      await refetch()
    } catch (err) {
      toast.error(
        'Failed to decline listing: ' +
          (err instanceof Error ? err.message : ''),
      )
    }
  }

  const pageData = data?.getPendingApprovals
  const items = pageData?.items ?? []

  return (
    <Container className='py-8'>
      <h1 className='text-2xl font-bold mb-2'>Admin Approvals</h1>
      <p className='text-muted-foreground mb-6'>
        Review and approve or decline content that requires admin attention.
      </p>

      {loading && (
        <div className='text-center py-8'>Loading pending approvals...</div>
      )}

      {error && (
        <div className='text-center py-8 text-red-500'>
          Failed to load approvals: {error.message}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className='text-center py-16 text-muted-foreground'>
          No pending approvals at the moment.
        </div>
      )}

      <div className='space-y-4'>
        {items.map((item) => (
          <Card
            key={item.id}
            className='p-4 flex flex-col gap-4'
          >
            <div className='flex items-center justify-between gap-2 flex-wrap'>
              <div>
                {item.listing.business ? (
                  <Link
                    href={
                      item.listing.business.slug
                        ? `/${item.listing.business.slug}`
                        : `/store/${item.listing.business.id}`
                    }
                    className='text-lg text-blue-600 hover:underline'
                  >
                    Business: {item.listing.business.name}
                  </Link>
                ) : item.listing.user ? (
                  <Link
                    href={`/seller/${item.listing.user.id}`}
                    className='text-lg text-blue-600 hover:underline'
                  >
                    User: {item.listing.user.firstName}{' '}
                    {item.listing.user.lastName}
                  </Link>
                ) : null}
                <h2 className='text-xl font-semibold  mb-4 '>
                  {item.listing.title || 'Untitled listing'}
                </h2>

                <div className='text-sm text-muted-foreground'>
                  Listing ID: {item.listing.id}
                </div>
              </div>
              <div className='flex items-center gap-2 flex-wrap'>
                {item.listing.nsfwFlagged && (
                  <Badge
                    variant={'secondary'}
                    className='uppercase'
                  >
                    18+
                  </Badge>
                )}
                <Badge variant='outline'>{item.flagType}</Badge>
                <Badge
                  className='uppercase'
                  variant={item.status === 'PENDING' ? 'default' : 'outline'}
                >
                  {item.status}
                </Badge>
              </div>
            </div>

            {item.listing.images && item.listing.images.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                {item.listing.images.map((image, index) => (
                  <div
                    key={index}
                    className='relative aspect-square rounded-md overflow-hidden bg-muted'
                  >
                    <Image
                      src={generateImageUrl(image)}
                      alt={`Listing image ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>
            )}

            <div className='flex justify-between items-center flex-wrap gap-4'>
              <div>
                <div className='text-sm text-muted-foreground'>
                  Created at: {new Date(item.createdAt).toLocaleString()}
                </div>

                {item.listing.nsfwApprovalStatus && (
                  <div className='text-sm'>
                    NSFW status:{' '}
                    <span className='font-medium'>
                      {item.listing.nsfwApprovalStatus}
                    </span>
                  </div>
                )}

                {item.approvalNotes && (
                  <div className='text-sm text-muted-foreground'>
                    Notes: {item.approvalNotes}
                  </div>
                )}
              </div>
              <div>
                <div className='mt-3 flex gap-2'>
                  <Button
                    variant='contained'
                    color='primary'
                    disabled={approving || declining}
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant='outlined'
                    color='primary'
                    disabled={approving || declining}
                    onClick={() => handleDecline(item.id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pageData && pageData.totalCount > pageData.pageSize && (
        <div className='flex items-center justify-between mt-6'>
          <Button
            variant='outlined'
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </Button>
          <div className='text-sm text-muted-foreground'>
            Page {pageData.pageNumber + 1} of{' '}
            {Math.ceil(pageData.totalCount / pageData.pageSize)}
          </div>
          <Button
            variant='outlined'
            disabled={!pageData.hasNextPage}
            onClick={() => {
              if (pageData.hasNextPage) {
                setPage((p) => p + 1)
              }
            }}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  )
}
