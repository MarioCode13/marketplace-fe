import { useEffect, useState } from 'react'
import { Transaction, Review } from '@/lib/graphql/types/trust'
import TransactionCard from './TransactionCard'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import ContactSellerModal from '@/components/modals/ContactSellerModal'
import { useApolloClient } from '@apollo/client'
import { GET_MY_REVIEW_FOR_TRANSACTION } from '@/lib/graphql/queries/getTransactions'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

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
  const client = useApolloClient()
  const [contactOpen, setContactOpen] = useState(false)
  const [contactSellerId, setContactSellerId] = useState<string | undefined>(
    undefined,
  )
  const [contactListingTitle, setContactListingTitle] = useState<
    string | undefined
  >(undefined)

  // Map of transactionId -> Review | null
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review | null>>(
    {},
  )

  const handleContact = (transaction: Transaction) => {
    setContactSellerId(transaction?.seller?.id)
    setContactListingTitle(transaction?.listing?.title)
    setContactOpen(true)
  }

  // Fetch existing review for each completed purchase once
  useEffect(() => {
    let mounted = true

    async function fetchReviews() {
      const map: Record<string, Review | null> = {}
      await Promise.all(
        completedPurchases.map(async (t) => {
          try {
            const res = await client.query({
              query: GET_MY_REVIEW_FOR_TRANSACTION,
              variables: { transactionId: t.id },
              fetchPolicy: 'network-only',
            })
            map[t.id] = res.data?.getMyReviewForTransaction || null
          } catch {
            map[t.id] = null
          }
        }),
      )

      if (mounted) setReviewsMap(map)
    }

    if (completedPurchases.length > 0) fetchReviews()

    return () => {
      mounted = false
    }
  }, [client, completedPurchases])

  // Split completed purchases into needs-review and reviewed
  const needsReview = completedPurchases.filter(
    (t) => !reviewsMap[t.id] && t.status === 'COMPLETED',
  )
  const reviewed = completedPurchases.filter(
    (t) => reviewsMap[t.id] && t.status === 'COMPLETED',
  )

  return (
    <>
      {/* Active purchases */}
      {purchases.length === 0 && (
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

      {/* Needs review (prominent) */}
      {needsReview.length > 0 && (
        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>Needs your review</h3>
          <p className='text-sm text-gray-600 mb-4'>
            {needsReview.length} purchases awaiting your review
          </p>
          {needsReview.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              type='purchase'
              handleReviewClick={onReviewClick}
              handleContact={handleContact}
            />
          ))}
        </div>
      )}

      {/* Reviewed purchases (collapsed and de-emphasized) using Accordion */}
      <div className='mt-6'>
        <Accordion
          type='single'
          collapsible
        >
          <AccordionItem value='reviewed'>
            <AccordionTrigger>
              <div className='flex items-center justify-between w-full'>
                <span className='text-lg font-semibold'>
                  Reviewed purchases
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {reviewed.length === 0 ? (
                <p className='text-sm text-gray-600 mt-2'>
                  No reviewed purchases yet.
                </p>
              ) : (
                <div className='mt-3'>
                  {reviewed.map((transaction) => (
                    <div
                      key={transaction.id}
                      className='opacity-70 text-sm mb-3'
                    >
                      <TransactionCard
                        transaction={transaction}
                        type='purchase'
                        existingReview={reviewsMap[transaction.id]}
                        handleReviewClick={onReviewClick}
                        handleContact={handleContact}
                      />
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <ContactSellerModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        sellerId={contactSellerId}
        listingTitle={contactListingTitle}
      />
    </>
  )
}
