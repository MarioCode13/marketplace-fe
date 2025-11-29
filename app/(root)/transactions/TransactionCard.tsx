import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Transaction } from '@/lib/graphql/types/trust'
import dayjs from 'dayjs'
import { CheckCircle, MessageSquare, Star } from 'lucide-react'
import Image from 'next/image'

export default function TransactionCard({
  transaction,
  type,
  completeTransaction,
  handleReviewClick,
  existingReview,
  handleContact,
}: {
  transaction: Transaction
  type: 'purchase' | 'sale'
  completeTransaction?: (args: { variables: { transactionId: string } }) => void
  handleReviewClick?: (transaction: Transaction) => void
  existingReview?: unknown
  handleContact?: (transaction: Transaction) => void
}): React.ReactElement {
  const isCompleted = transaction.status === 'COMPLETED'
  const isPending = transaction.status === 'PENDING'
  const canReview = type === 'purchase' && isCompleted
  const canComplete = type === 'sale' && isPending

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'DISPUTED':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          <Image
            src={transaction.listing.images[0] || '/placeholder.png'}
            alt={transaction.listing.title}
            width={80}
            height={80}
            className='rounded-md object-cover'
          />

          <div className='flex-1'>
            <div className='flex items-start justify-between mb-2'>
              <div>
                <h3 className='font-semibold text-lg'>
                  {transaction.listing.title}
                </h3>
                <p className='text-sm text-gray-600'>
                  {type === 'purchase' ? 'Bought from' : 'Sold to'}:{' '}
                  {type === 'purchase'
                    ? transaction.seller.username
                    : transaction.buyer.username}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-bold text-lg text-green-600'>
                  ${transaction.salePrice}
                </p>
                <Badge
                  variant='outline'
                  className={getStatusColor(transaction.status)}
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>

            <div className='flex items-center justify-between text-sm text-gray-500 mb-2'>
              <span>
                Date: {dayjs(transaction.saleDate).format('MMM DD, YYYY')}
              </span>
              {transaction.paymentMethod && (
                <span>Payment: {transaction.paymentMethod}</span>
              )}
            </div>

            {transaction.notes && (
              <p className='text-sm text-gray-600 mb-2'>
                Notes: {transaction.notes}
              </p>
            )}

            <div className='flex gap-2'>
              {canReview && handleReviewClick && (
                <Button
                  size='sm'
                  onClick={() => handleReviewClick(transaction)}
                  className='flex items-center gap-1'
                >
                  <Star className='w-4 h-4' />
                  {existingReview ? 'Edit Review' : 'Leave Review'}
                </Button>
              )}

              {canComplete && completeTransaction && (
                <Button
                  size='sm'
                  onClick={() =>
                    completeTransaction({
                      variables: { transactionId: transaction.id },
                    })
                  }
                  className='flex items-center gap-1'
                >
                  <CheckCircle className='w-4 h-4' />
                  Complete Sale
                </Button>
              )}

              <Button
                size='sm'
                variant='outlined'
                onClick={() => handleContact && handleContact(transaction)}
                className='flex items-center gap-1'
              >
                <MessageSquare className='w-4 h-4' />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
