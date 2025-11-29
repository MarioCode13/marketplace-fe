'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, ShoppingCart } from 'lucide-react'
import ReviewModal from '@/components/modals/ReviewModal'
import { toast } from 'sonner'
import {
  GET_MY_PURCHASES,
  GET_MY_SALES,
  GET_MY_COMPLETED_PURCHASES,
  GET_MY_COMPLETED_SALES,
} from '@/lib/graphql/queries'
import { Transaction, Review } from '@/lib/graphql/types/trust'
import { COMPLETE_TRANSACTION } from '@/lib/graphql/mutations/transactionMutations'
import Purchases from './Purchases'
import Sales from './Sales'

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [existingReview, setExistingReview] = useState<Review | null>(null)

  const { data: purchasesData, loading: purchasesLoading } =
    useQuery(GET_MY_PURCHASES)
  const { data: salesData, loading: salesLoading } = useQuery(GET_MY_SALES)
  const { data: completedPurchasesData } = useQuery(GET_MY_COMPLETED_PURCHASES)
  const { data: completedSalesData } = useQuery(GET_MY_COMPLETED_SALES)

  const [completeTransaction] = useMutation(COMPLETE_TRANSACTION, {
    onCompleted: () => {
      toast.success('Transaction completed successfully!')
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to complete transaction: ${error.message}`)
    },
  })

  const purchases = purchasesData?.myPurchases || []
  const sales = salesData?.mySales || []
  const completedPurchases = completedPurchasesData?.myCompletedPurchases || []
  const completedSales = completedSalesData?.myCompletedSales || []

  const handleReviewClick = async (transaction: Transaction) => {
    setSelectedTransaction(transaction)

    try {
      setExistingReview(null)
    } catch {
      setExistingReview(null)
    }

    setReviewModalOpen(true)
  }

  const handleReviewSubmitted = () => {
    window.location.reload()
  }

  if (purchasesLoading || salesLoading) {
    return (
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-7xl py-8 px-6'>
          <div className='animate-pulse'>Loading transactions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='flex flex-col py-12 px-6 w-full max-w-7xl min-h-[70vh]'>
        {/* Header with title */}
        <div className='flex items-center justify-between w-full mb-6'>
          <div className='w-12'></div> {/* Spacer to balance the layout */}
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>My Transactions</h1>
          </div>
          <div className='w-12'></div> {/* Spacer to balance the layout */}
        </div>

        <p className='text-gray-600 mb-6 text-center'>
          Manage your purchases and sales
        </p>

        <Tabs
          defaultValue='purchases'
          className='w-full '
        >
          <TabsList className='grid w-full grid-cols-2 gap-4'>
            <TabsTrigger
              value='purchases'
              className='flex items-center gap-2'
            >
              <ShoppingCart className='w-4 h-4' />
              Purchases ({purchases.length})
            </TabsTrigger>
            <TabsTrigger
              value='sales'
              className='flex items-center gap-2'
            >
              <Package className='w-4 h-4' />
              Sales ({sales.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='purchases'
            className='mt-6'
          >
            <Purchases
              purchases={purchases}
              completedPurchases={completedPurchases}
              onReviewClick={handleReviewClick}
            />
          </TabsContent>

          <TabsContent
            value='sales'
            className='mt-6'
          >
            <Sales
              sales={sales}
              completedSales={completedSales}
              completeTransaction={completeTransaction}
              onReviewClick={handleReviewClick}
            />
          </TabsContent>
        </Tabs>

        {/* Review Modal */}
        {selectedTransaction && (
          <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => {
              setReviewModalOpen(false)
              setSelectedTransaction(null)
              setExistingReview(null)
            }}
            transaction={selectedTransaction}
            existingReview={existingReview}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </div>
    </div>
  )
}
