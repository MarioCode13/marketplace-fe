import React, { useState } from 'react'
import TransactionCard from './TransactionCard'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { Transaction } from '@/lib/graphql/types/trust'
import ContactSellerModal from '@/components/modals/ContactSellerModal'

interface SalesProps {
  sales: Transaction[]
  completedSales: Transaction[]
  completeTransaction?: (args: { variables: { transactionId: string } }) => void
  onReviewClick?: (transaction: Transaction) => void
}

export default function Sales({
  sales,
  completedSales,
  completeTransaction,
  onReviewClick,
}: SalesProps) {
  const [contactOpen, setContactOpen] = useState(false)
  const [contactSellerId, setContactSellerId] = useState<string | undefined>(
    undefined,
  )
  const [contactListingTitle, setContactListingTitle] = useState<
    string | undefined
  >(undefined)

  const handleContact = (transaction: Transaction) => {
    setContactSellerId(transaction?.buyer?.id)
    setContactListingTitle(transaction?.listing?.title)
    setContactOpen(true)
  }

  return (
    <>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold mb-2'>My Sales</h2>
        <p className='text-sm text-gray-600'>
          {completedSales.length} completed sales
        </p>
      </div>

      {sales.length > 0 ? (
        sales.map((transaction: Transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            type='sale'
            completeTransaction={completeTransaction}
            handleReviewClick={onReviewClick}
            handleContact={handleContact}
          />
        ))
      ) : (
        <Card>
          <CardContent className='p-8 text-center'>
            <Package className='w-12 h-12 mx-auto text-gray-400 mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No sales yet</h3>
            <p className='text-gray-600'>
              Start selling to see your sales history here.
            </p>
          </CardContent>
        </Card>
      )}

      <ContactSellerModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        sellerId={contactSellerId}
        listingTitle={contactListingTitle}
      />
    </>
  )
}
