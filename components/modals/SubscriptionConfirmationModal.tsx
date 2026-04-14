'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SubscriptionTier {
  name: string
  price: string
  accountType: string
  features: string[]
  limitations: string[]
}

interface SubscriptionConfirmationModalProps {
  open: boolean
  selectedTier: SubscriptionTier | null
  couponCode: string
  setCouponCode: (value: string) => void
  loadingTier: string | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export default function SubscriptionConfirmationModal({
  open,
  selectedTier,
  couponCode,
  setCouponCode,
  loadingTier,
  onOpenChange,
  onConfirm,
}: SubscriptionConfirmationModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Confirm subscription</DialogTitle>
          <DialogDescription>
            Review your upgrade details before continuing.
          </DialogDescription>
        </DialogHeader>

        {selectedTier && (
          <div className='space-y-4'>
            <div className='rounded-2xl border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 p-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Plan</p>
                  <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {selectedTier.name}
                  </p>
                </div>
                <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>
                  {selectedTier.price}
                </p>
              </div>
              <p className='mt-3 text-sm text-gray-600 dark:text-gray-300'>
                {selectedTier.accountType === 'Business'
                  ? 'Your profile will be upgraded to a business account.'
                  : 'Your profile will be upgraded to a verified personal account.'}
              </p>
            </div>

            <div className='grid gap-4'>
              <div>
                <Label htmlFor='subscription-promo'>
                  Promo code (optional)
                </Label>
                <Input
                  id='subscription-promo'
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder='Enter promo code'
                  className='bg-componentBackground'
                  autoComplete='off'
                />
              </div>

              <div className='grid gap-3'>
                <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                  Summary
                </p>
                <ul className='grid gap-2 text-sm text-gray-700 dark:text-gray-300'>
                  {selectedTier.features.map((feature) => (
                    <li
                      key={feature}
                      className='flex items-start gap-2'
                    >
                      <span className='mt-0.5 text-green-500'>•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {/* {selectedTier.limitations.length > 0 && (
                  <div className='rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950 p-3'>
                    <p className='text-sm font-semibold text-orange-700 dark:text-orange-200'>
                      Limitations
                    </p>
                    <p className='text-xs text-orange-700 dark:text-orange-300'>
                      {selectedTier.limitations.join(' · ')}
                    </p>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className='gap-2 mt-4'>
          <DialogClose asChild>
            <Button
              variant='outlined'
              className='w-full sm:w-auto'
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className='w-full sm:w-auto'
            variant={'contained'}
            disabled={!selectedTier || loadingTier !== null}
            onClick={async () => {
              if (selectedTier) {
                await onConfirm()
              }
            }}
          >
            {loadingTier ? 'Processing...' : 'Proceed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
