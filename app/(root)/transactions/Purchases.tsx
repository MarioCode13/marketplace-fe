import { Transaction } from '@/lib/graphql/types/trust'
import TransactionCard from './TransactionCard'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import ContactSellerModal from '@/components/modals/ContactSellerModal'
import { useState } from 'react'

interface PurchasesProps {
  purchases: Transaction[]
  completedPurchases: Transaction[]
  onReviewClick?: (transaction: Transaction) => void
}

export default function Purchases({
  purchases,
  completedPurchases,
  onReviewClick,
}: PurchasesProps) {
  const [contactOpen, setContactOpen] = useState(false)
  const [contactSellerEmail, setContactSellerEmail] = useState('')

  const handleContact = (transaction: Transaction) => {
    setContactSellerEmail(transaction?.seller?.email || '')
    setContactOpen(true)
  }

  return (
    <>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold mb-2'>My Purchases</h2>
        <p className='text-sm text-gray-600'>
          {completedPurchases.length} completed purchases
        </p>
      </div>

      {purchases.length > 0 ? (
        purchases.map((transaction: Transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            type='purchase'
            handleReviewClick={onReviewClick}
            handleContact={handleContact}
          />
        ))
      ) : (
        <Card>
          <CardContent className='p-8 text-center'>
            <Package className='w-12 h-12 mx-auto text-gray-400 mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No purchases yet</h3>
            <p className='text-gray-600'>
              Start shopping to see your purchase history here.
            </p>
          </CardContent>
        </Card>
      )}

      <ContactSellerModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        sellerEmail={contactSellerEmail}
      />
    </>
  )
}
