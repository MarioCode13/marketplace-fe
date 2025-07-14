'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Star, Search, User, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'
import { CREATE_TRANSACTION } from '@/lib/graphql/mutations/transactionMutations'
import { SEARCH_USERS } from '@/lib/graphql/queries/getUsers'
import { Listing } from '@/lib/graphql/types/trust'
import Image from 'next/image'

interface User {
  id: string
  username: string
  email: string
  profileImageUrl?: string
  firstName?: string
  lastName?: string
  location?: string
  trustRating?: {
    overallScore: number
    starRating: number
    trustLevel: string
    totalReviews: number
    totalTransactions: number
    successfulTransactions: number
  }
}

interface MarkAsSoldModalProps {
  isOpen: boolean
  onClose: () => void
  listing: Listing
  onSuccess: () => void
}

export default function MarkAsSoldModal({
  isOpen,
  onClose,
  listing,
  onSuccess,
}: MarkAsSoldModalProps) {
  const [selectedBuyer, setSelectedBuyer] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [salePrice, setSalePrice] = useState(listing.price.toString())
  const [paymentMethod, setPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const [createTransaction, { loading: creatingTransaction }] = useMutation(
    CREATE_TRANSACTION,
    {
      onCompleted: () => {
        toast.success('Transaction created successfully!')
        onSuccess()
        onClose()
        resetForm()
      },
      onError: (error) => {
        toast.error(`Failed to create transaction: ${error.message}`)
      },
    }
  )

  const [searchUsers, { data: searchData, loading: searching }] = useLazyQuery(
    SEARCH_USERS,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  const users = searchData?.searchUsers || []

  const resetForm = useCallback(() => {
    setSelectedBuyer(null)
    setSearchTerm('')
    setSalePrice(listing.price.toString())
    setPaymentMethod('')
    setNotes('')
    setShowSearchResults(false)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }, [listing.price])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen, resetForm])

  // Debounced search
  const debouncedSearch = useCallback(
    (term: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      if (term.length >= 2) {
        searchTimeoutRef.current = setTimeout(() => {
          searchUsers({ variables: { searchTerm: term } })
        }, 300)
      }
    },
    [searchUsers]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
      if (value.length >= 2) {
        setShowSearchResults(true)
        debouncedSearch(value)
      } else {
        setShowSearchResults(false)
      }
    },
    [debouncedSearch]
  )

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (searchTerm.length >= 2) {
      setShowSearchResults(true)
    }
  }, [searchTerm])

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setShowSearchResults(false)
    }, 200)
  }, [])

  // Handle buyer selection
  const handleBuyerSelect = useCallback((user: User) => {
    setSelectedBuyer(user)
    setSearchTerm('')
    setShowSearchResults(false)
  }, [])

  const handleChangeBuyer = useCallback(() => {
    setSelectedBuyer(null)
    setSearchTerm('')
    setShowSearchResults(false)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }, [])

  const handlePaymentMethodChange = useCallback((value: string) => {
    setPaymentMethod(value)
  }, [])

  const handleSalePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSalePrice(e.target.value)
    },
    []
  )

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!selectedBuyer) {
        toast.error('Please select a buyer')
        return
      }

      if (!salePrice || parseFloat(salePrice) <= 0) {
        toast.error('Please enter a valid sale price')
        return
      }
      await createTransaction({
        variables: {
          listingId: listing.id,
          buyerId: selectedBuyer.id,
          salePrice: parseFloat(salePrice),
          paymentMethod: paymentMethod || undefined,
          notes: notes || undefined,
        },
      })
    },
    [
      selectedBuyer,
      salePrice,
      paymentMethod,
      notes,
      listing.id,
      createTransaction,
    ]
  )

  const getTrustLevelColor = (trustLevel: string) => {
    switch (trustLevel) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'VERY_GOOD':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'GOOD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAIR':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'POOR':
      case 'VERY_POOR':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Mark as Sold</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Listing Details</h3>
            <p className='text-sm text-gray-600'>{listing.title}</p>
            <p className='text-sm text-gray-600'>
              Original Price: ${listing.price}
            </p>
          </div>

          <div>
            <Label htmlFor='salePrice'>Sale Price *</Label>
            <Input
              id='salePrice'
              type='number'
              step='0.01'
              min='0'
              value={salePrice}
              onChange={handleSalePriceChange}
              placeholder='Enter sale price'
              required
            />
          </div>

          <div>
            <Label htmlFor='paymentMethod'>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={handlePaymentMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select payment method' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CASH'>Cash</SelectItem>
                <SelectItem value='BANK_TRANSFER'>Bank Transfer</SelectItem>
                <SelectItem value='PAYPAL'>PayPal</SelectItem>
                <SelectItem value='CREDIT_CARD'>Credit Card</SelectItem>
                <SelectItem value='OTHER'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='buyerSearch'>Select Buyer *</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                ref={searchInputRef}
                id='buyerSearch'
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder='Search by username or email...'
                className='pl-10'
              />
            </div>

            {showSearchResults && !selectedBuyer && (
              <div className='mt-2 max-h-60 overflow-y-auto border rounded-lg'>
                {searching ? (
                  <div className='p-4 text-center text-gray-500'>
                    Searching...
                  </div>
                ) : users.length > 0 ? (
                  <div className='divide-y'>
                    {users.map((user: User) => (
                      <div
                        key={user.id}
                        className='p-3 cursor-pointer hover:bg-gray-50'
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleBuyerSelect(user)
                        }}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
                            {user.profileImageUrl ? (
                              <Image
                                src={user.profileImageUrl}
                                alt={user.username}
                                width={32}
                                height={32}
                                className='h-8 w-8 rounded-full object-cover'
                              />
                            ) : (
                              <User className='h-4 w-4 text-gray-500' />
                            )}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium'>
                                {user.username || user.email}
                              </span>
                              {user.trustRating && (
                                <div className='flex items-center gap-1'>
                                  <Star className='h-3 w-3 text-yellow-500 fill-current' />
                                  <span className='text-xs text-gray-600'>
                                    {user.trustRating.starRating.toFixed(1)}
                                  </span>
                                  <Badge
                                    variant='outline'
                                    className={`text-xs ${getTrustLevelColor(
                                      user.trustRating.trustLevel
                                    )}`}
                                  >
                                    {user.trustRating.trustLevel}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            {user.location && (
                              <div className='flex items-center gap-1 text-xs text-gray-500'>
                                <MapPin className='h-3 w-3' />
                                {user.location}
                              </div>
                            )}
                            {user.trustRating && (
                              <div className='text-xs text-gray-500'>
                                {user.trustRating.totalTransactions}{' '}
                                transactions, {user.trustRating.totalReviews}{' '}
                                reviews
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='p-4 text-center text-gray-500'>
                    No users found
                  </div>
                )}
              </div>
            )}

            {/* Selected Buyer */}
            {selectedBuyer && (
              <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    {selectedBuyer.profileImageUrl ? (
                      <Image
                        src={selectedBuyer.profileImageUrl}
                        alt={selectedBuyer.username}
                        width={40}
                        height={40}
                        className='h-10 w-10 rounded-full object-cover'
                      />
                    ) : (
                      <User className='h-5 w-5 text-gray-500' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium'>
                      {selectedBuyer.username || selectedBuyer.email}
                    </p>
                    {selectedBuyer.trustRating && (
                      <div className='flex items-center gap-1 text-sm text-gray-600'>
                        <Star className='h-3 w-3 text-yellow-500 fill-current' />
                        <span>
                          {selectedBuyer.trustRating.starRating.toFixed(1)}
                        </span>
                        <Badge
                          variant='outline'
                          className={`text-xs ${getTrustLevelColor(
                            selectedBuyer.trustRating.trustLevel
                          )}`}
                        >
                          {selectedBuyer.trustRating.trustLevel}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    type='button'
                    variant='default'
                    size='sm'
                    onClick={handleChangeBuyer}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              value={notes}
              onChange={handleNotesChange}
              placeholder='Add any additional notes about the sale...'
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className='flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!selectedBuyer || creatingTransaction}
            >
              {creatingTransaction ? 'Creating Transaction...' : 'Mark as Sold'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
