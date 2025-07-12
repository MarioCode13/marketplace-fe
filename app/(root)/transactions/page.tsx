'use client'

import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Package, ShoppingCart, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import dayjs from 'dayjs'
import ReviewModal from '@/components/modals/ReviewModal'
import { 
  GET_MY_PURCHASES, 
  GET_MY_SALES, 
  GET_MY_COMPLETED_PURCHASES, 
  GET_MY_COMPLETED_SALES,
  GET_MY_REVIEW_FOR_TRANSACTION
} from '@/lib/graphql/queries'
import { Transaction, Review } from '@/lib/graphql/types/trust'

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [existingReview, setExistingReview] = useState<Review | null>(null)

  const { data: purchasesData, loading: purchasesLoading } = useQuery(GET_MY_PURCHASES)
  const { data: salesData, loading: salesLoading } = useQuery(GET_MY_SALES)
  const { data: completedPurchasesData } = useQuery(GET_MY_COMPLETED_PURCHASES)
  const { data: completedSalesData } = useQuery(GET_MY_COMPLETED_SALES)

  const purchases = purchasesData?.myPurchases || []
  const sales = salesData?.mySales || []
  const completedPurchases = completedPurchasesData?.myCompletedPurchases || []
  const completedSales = completedSalesData?.myCompletedSales || []

  const handleReviewClick = async (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    
    // Check if user already reviewed this transaction
    try {
      // This would need to be implemented with a proper query
      // For now, we'll assume no existing review
      setExistingReview(null)
    } catch (error) {
      setExistingReview(null)
    }
    
    setReviewModalOpen(true)
  }

  const handleReviewSubmitted = () => {
    // Refetch data to show updated review status
    window.location.reload()
  }

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

  const TransactionCard = ({ transaction, type }: { transaction: Transaction; type: 'purchase' | 'sale' }) => {
    const isCompleted = transaction.status === 'COMPLETED'
    const canReview = type === 'purchase' && isCompleted

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Image
              src={transaction.listing.images[0] || '/placeholder.png'}
              alt={transaction.listing.title}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{transaction.listing.title}</h3>
                  <p className="text-sm text-gray-600">
                    {type === 'purchase' ? 'Bought from' : 'Sold to'}: {type === 'purchase' ? transaction.seller.username : transaction.buyer.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">${transaction.salePrice}</p>
                  <Badge variant="outline" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Date: {dayjs(transaction.saleDate).format('MMM DD, YYYY')}</span>
                {transaction.paymentMethod && (
                  <span>Payment: {transaction.paymentMethod}</span>
                )}
              </div>
              
              {transaction.notes && (
                <p className="text-sm text-gray-600 mb-2">Notes: {transaction.notes}</p>
              )}
              
              <div className="flex gap-2">
                {canReview && (
                  <Button
                    size="sm"
                    onClick={() => handleReviewClick(transaction)}
                    className="flex items-center gap-1"
                  >
                    <Star className="w-4 h-4" />
                    {existingReview ? 'Edit Review' : 'Leave Review'}
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {/* TODO: Implement contact functionality */}}
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (purchasesLoading || salesLoading) {
    return <div className="animate-pulse">Loading transactions...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Transactions</h1>
        <p className="text-gray-600">Manage your purchases and sales</p>
      </div>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Purchases ({purchases.length})
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Sales ({sales.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">My Purchases</h2>
            <p className="text-sm text-gray-600">
              {completedPurchases.length} completed purchases
            </p>
          </div>
          
          {purchases.length > 0 ? (
            purchases.map((transaction: Transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} type="purchase" />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                <p className="text-gray-600">Start shopping to see your purchase history here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">My Sales</h2>
            <p className="text-sm text-gray-600">
              {completedSales.length} completed sales
            </p>
          </div>
          
          {sales.length > 0 ? (
            sales.map((transaction: Transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} type="sale" />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sales yet</h3>
                <p className="text-gray-600">Start selling to see your sales history here.</p>
              </CardContent>
            </Card>
          )}
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
  )
} 