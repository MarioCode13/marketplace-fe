'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_ADMIN_SUBSCRIPTION_PROMO_COUPONS,
  GET_ADMIN_LISTING_BOOST_PROMO_COUPONS,
} from '@/lib/graphql/queries/adminPromoCoupons'
import {
  ADMIN_SAVE_SUBSCRIPTION_PROMO_COUPON,
  ADMIN_DELETE_SUBSCRIPTION_PROMO_COUPON,
  ADMIN_SAVE_LISTING_BOOST_PROMO_COUPON,
  ADMIN_DELETE_LISTING_BOOST_PROMO_COUPON,
} from '@/lib/graphql/mutations/adminPromoCouponMutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'

const DISCOUNT_TYPES = ['FULL_WAIVE', 'PERCENT', 'FIXED_AMOUNT'] as const

type SubCoupon = {
  id: string
  code: string
  discountType: string
  percentOff?: number | null
  amountOff?: number | null
  maxRedemptions?: number | null
  expiresAt?: string | null
  active: boolean
  applicablePlanTypes?: string | null
  createdAt: string
}

type BoostCoupon = {
  id: string
  code: string
  discountType: string
  percentOff?: number | null
  amountOff?: number | null
  maxRedemptions?: number | null
  expiresAt?: string | null
  active: boolean
  applicableDurationDays?: string | null
  createdAt: string
}

export default function AdminCouponsPage() {
  const { data: subData, refetch: refetchSub } = useQuery(
    GET_ADMIN_SUBSCRIPTION_PROMO_COUPONS,
    { fetchPolicy: 'network-only' },
  )
  const { data: boostData, refetch: refetchBoost } = useQuery(
    GET_ADMIN_LISTING_BOOST_PROMO_COUPONS,
    { fetchPolicy: 'network-only' },
  )

  const [saveSub] = useMutation(ADMIN_SAVE_SUBSCRIPTION_PROMO_COUPON)
  const [delSub] = useMutation(ADMIN_DELETE_SUBSCRIPTION_PROMO_COUPON)
  const [saveBoost] = useMutation(ADMIN_SAVE_LISTING_BOOST_PROMO_COUPON)
  const [delBoost] = useMutation(ADMIN_DELETE_LISTING_BOOST_PROMO_COUPON)

  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [boostDialogOpen, setBoostDialogOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<SubCoupon | 'new' | null>(null)
  const [editingBoost, setEditingBoost] = useState<BoostCoupon | 'new' | null>(
    null,
  )

  const [formCode, setFormCode] = useState('')
  const [formDiscountType, setFormDiscountType] = useState<string>('FULL_WAIVE')
  const [formPercent, setFormPercent] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formMax, setFormMax] = useState('')
  const [formExpires, setFormExpires] = useState('')
  const [formActive, setFormActive] = useState(true)
  const [formPlans, setFormPlans] = useState('')
  const [formDurations, setFormDurations] = useState('')

  const [deleteSubDialogOpen, setDeleteSubDialogOpen] = useState(false)
  const [deleteBoostDialogOpen, setDeleteBoostDialogOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<{
    id: string
    type: 'sub' | 'boost'
  } | null>(null)

  const openNewSub = () => {
    setFormCode('')
    setFormDiscountType('FULL_WAIVE')
    setFormPercent('')
    setFormAmount('')
    setFormMax('')
    setFormExpires('')
    setFormActive(true)
    setFormPlans('')
    setSubDialogOpen(true)
  }

  const openEditSub = (c: SubCoupon) => {
    setEditingSub(c)
    setFormCode(c.code)
    setFormDiscountType(c.discountType)
    setFormPercent(c.percentOff != null ? String(c.percentOff) : '')
    setFormAmount(c.amountOff != null ? String(c.amountOff) : '')
    setFormMax(c.maxRedemptions != null ? String(c.maxRedemptions) : '')
    setFormExpires(c.expiresAt || '')
    setFormActive(c.active)
    setFormPlans(c.applicablePlanTypes || '')
    setSubDialogOpen(true)
  }

  const openNewBoost = () => {
    setEditingBoost('new')
    setFormCode('')
    setFormDiscountType('FULL_WAIVE')
    setFormPercent('')
    setFormAmount('')
    setFormMax('')
    setFormExpires('')
    setFormActive(true)
    setFormDurations('')
    setBoostDialogOpen(true)
  }

  const openEditBoost = (c: BoostCoupon) => {
    setEditingBoost(c)
    setFormCode(c.code)
    setFormDiscountType(c.discountType)
    setFormPercent(c.percentOff != null ? String(c.percentOff) : '')
    setFormAmount(c.amountOff != null ? String(c.amountOff) : '')
    setFormMax(c.maxRedemptions != null ? String(c.maxRedemptions) : '')
    setFormExpires(c.expiresAt || '')
    setFormActive(c.active)
    setFormDurations(c.applicableDurationDays || '')
    setBoostDialogOpen(true)
  }

  const buildSubInput = () => ({
    id: editingSub && editingSub !== 'new' ? editingSub.id : undefined,
    code: formCode.trim(),
    discountType: formDiscountType,
    percentOff: formPercent.trim() ? parseFloat(formPercent) : null,
    amountOff: formAmount.trim() ? parseFloat(formAmount) : null,
    maxRedemptions: formMax.trim() ? parseInt(formMax, 10) : null,
    expiresAt: formExpires.trim() || null,
    active: formActive,
    applicablePlanTypes: formPlans.trim() || null,
  })

  const buildBoostInput = () => ({
    id: editingBoost && editingBoost !== 'new' ? editingBoost.id : undefined,
    code: formCode.trim(),
    discountType: formDiscountType,
    percentOff: formPercent.trim() ? parseFloat(formPercent) : null,
    amountOff: formAmount.trim() ? parseFloat(formAmount) : null,
    maxRedemptions: formMax.trim() ? parseInt(formMax, 10) : null,
    expiresAt: formExpires.trim() || null,
    active: formActive,
    applicableDurationDays: formDurations.trim() || null,
  })

  const handleSaveSub = async () => {
    try {
      await saveSub({ variables: { input: buildSubInput() } })
      toast.success('Subscription coupon saved')
      setSubDialogOpen(false)
      setEditingSub(null)
      await refetchSub()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const handleSaveBoost = async () => {
    try {
      await saveBoost({ variables: { input: buildBoostInput() } })
      toast.success('Boost coupon saved')
      setBoostDialogOpen(false)
      setEditingBoost(null)
      await refetchBoost()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const handleDeleteSub = (id: string) => {
    setCouponToDelete({ id, type: 'sub' })
    setDeleteSubDialogOpen(true)
  }

  const handleDeleteBoost = (id: string) => {
    setCouponToDelete({ id, type: 'boost' })
    setDeleteBoostDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return

    try {
      if (couponToDelete.type === 'sub') {
        await delSub({ variables: { id: couponToDelete.id } })
        await refetchSub()
        toast.success('Subscription coupon deleted successfully')
      } else {
        await delBoost({ variables: { id: couponToDelete.id } })
        await refetchBoost()
        toast.success('Boost coupon deleted successfully')
      }
      setDeleteSubDialogOpen(false)
      setDeleteBoostDialogOpen(false)
      setCouponToDelete(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteSubDialogOpen(false)
    setDeleteBoostDialogOpen(false)
    setCouponToDelete(null)
  }

  const subs: SubCoupon[] = subData?.adminSubscriptionPromoCoupons ?? []
  const boosts: BoostCoupon[] = boostData?.adminListingBoostPromoCoupons ?? []

  return (
    <div className='space-y-10'>
      <section>
        <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-xl font-semibold'>Subscription coupons</h2>
          <Button
            variant='contained'
            onClick={openNewSub}
          >
            Add coupon
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>% / amt</TableHead>
                <TableHead>Max</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Plans</TableHead>
                <TableHead className='w-32'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className='font-mono'>{c.code}</TableCell>
                  <TableCell>{c.discountType}</TableCell>
                  <TableCell>
                    {c.percentOff != null
                      ? `${c.percentOff}%`
                      : c.amountOff != null
                        ? `R${c.amountOff}`
                        : '—'}
                  </TableCell>
                  <TableCell>{c.maxRedemptions ?? '—'}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {c.expiresAt?.slice(0, 10) ?? '—'}
                  </TableCell>
                  <TableCell>{c.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell className='max-w-[140px] truncate'>
                    {c.applicablePlanTypes ?? 'All'}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button
                        size='icon'
                        variant='text'
                        onClick={() => openEditSub(c)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        size='icon'
                        variant='text'
                        className='text-red-600'
                        onClick={() => handleDeleteSub(c.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {subs.length === 0 && (
            <p className='p-6 text-muted-foreground'>
              No subscription coupons.
            </p>
          )}
        </div>
      </section>

      <section>
        <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <h2 className='text-xl font-semibold'>Listing boost coupons</h2>
          <Button
            variant='contained'
            onClick={openNewBoost}
          >
            Add coupon
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>% / amt</TableHead>
                <TableHead>Max</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Durations</TableHead>
                <TableHead className='w-32'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boosts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className='font-mono'>{c.code}</TableCell>
                  <TableCell>{c.discountType}</TableCell>
                  <TableCell>
                    {c.percentOff != null
                      ? `${c.percentOff}%`
                      : c.amountOff != null
                        ? `R${c.amountOff}`
                        : '—'}
                  </TableCell>
                  <TableCell>{c.maxRedemptions ?? '—'}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {c.expiresAt?.slice(0, 10) ?? '—'}
                  </TableCell>
                  <TableCell>{c.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell className='max-w-[140px] truncate'>
                    {c.applicableDurationDays ?? 'All'}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button
                        size='icon'
                        variant='text'
                        onClick={() => openEditBoost(c)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        size='icon'
                        variant='text'
                        className='text-red-600'
                        onClick={() => handleDeleteBoost(c.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {boosts.length === 0 && (
            <p className='p-6 text-muted-foreground'>No boost coupons.</p>
          )}
        </div>
      </section>

      <Dialog
        open={subDialogOpen}
        onOpenChange={(o) => {
          setSubDialogOpen(o)
          if (!o) setEditingSub(null)
        }}
      >
        <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingSub === 'new' ? 'New' : 'Edit'} subscription coupon
            </DialogTitle>
          </DialogHeader>
          <CouponFormFields
            formCode={formCode}
            setFormCode={setFormCode}
            formDiscountType={formDiscountType}
            setFormDiscountType={setFormDiscountType}
            formPercent={formPercent}
            setFormPercent={setFormPercent}
            formAmount={formAmount}
            setFormAmount={setFormAmount}
            formMax={formMax}
            setFormMax={setFormMax}
            formExpires={formExpires}
            setFormExpires={setFormExpires}
            formActive={formActive}
            setFormActive={setFormActive}
            extraPlans={formPlans}
            setExtraPlans={setFormPlans}
            extraLabel='Applicable plans (comma-separated, e.g. SELLER_PLUS,PRO_STORE; empty = all)'
          />
          <DialogFooter className='gap-2'>
            <Button
              variant='outlined'
              onClick={() => setSubDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSaveSub()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={boostDialogOpen}
        onOpenChange={(o) => {
          setBoostDialogOpen(o)
          if (!o) setEditingBoost(null)
        }}
      >
        <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingBoost === 'new' ? 'New' : 'Edit'} boost coupon
            </DialogTitle>
          </DialogHeader>
          <CouponFormFields
            formCode={formCode}
            setFormCode={setFormCode}
            formDiscountType={formDiscountType}
            setFormDiscountType={setFormDiscountType}
            formPercent={formPercent}
            setFormPercent={setFormPercent}
            formAmount={formAmount}
            setFormAmount={setFormAmount}
            formMax={formMax}
            setFormMax={setFormMax}
            formExpires={formExpires}
            setFormExpires={setFormExpires}
            formActive={formActive}
            setFormActive={setFormActive}
            extraPlans={formDurations}
            setExtraPlans={setFormDurations}
            extraLabel='Applicable durations (comma-separated 7,14,30; empty = all)'
          />
          <DialogFooter className='gap-2'>
            <Button
              variant='outlined'
              onClick={() => setBoostDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSaveBoost()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteSubDialogOpen}
        onOpenChange={setDeleteSubDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription coupon? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color={'primary'}
              variant='outlined'
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteBoostDialogOpen}
        onOpenChange={setDeleteBoostDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Boost Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this boost coupon? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color={'primary'}
              variant='outlined'
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CouponFormFields(props: {
  formCode: string
  setFormCode: (v: string) => void
  formDiscountType: string
  setFormDiscountType: (v: string) => void
  formPercent: string
  setFormPercent: (v: string) => void
  formAmount: string
  setFormAmount: (v: string) => void
  formMax: string
  setFormMax: (v: string) => void
  formExpires: string
  setFormExpires: (v: string) => void
  formActive: boolean
  setFormActive: (v: boolean) => void
  extraPlans: string
  setExtraPlans: (v: string) => void
  extraLabel: string
}) {
  const {
    formCode,
    setFormCode,
    formDiscountType,
    setFormDiscountType,
    formPercent,
    setFormPercent,
    formAmount,
    setFormAmount,
    formMax,
    setFormMax,
    formExpires,
    setFormExpires,
    formActive,
    setFormActive,
    extraPlans,
    setExtraPlans,
    extraLabel,
  } = props

  return (
    <div className='space-y-4 py-2'>
      <div>
        <Label htmlFor='c-code'>Code</Label>
        <Input
          id='c-code'
          value={formCode}
          onChange={(e) => setFormCode(e.target.value)}
          className='mt-1 font-mono'
        />
      </div>
      <div>
        <Label>Discount type</Label>
        <Select
          value={formDiscountType}
          onValueChange={setFormDiscountType}
        >
          <SelectTrigger className='mt-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DISCOUNT_TYPES.map((t) => (
              <SelectItem
                key={t}
                value={t}
              >
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor='c-pct'>Percent off (e.g. 50 for 50%)</Label>
        <Input
          id='c-pct'
          value={formPercent}
          onChange={(e) => setFormPercent(e.target.value)}
          className='mt-1'
        />
      </div>
      <div>
        <Label htmlFor='c-amt'>Amount off (ZAR)</Label>
        <Input
          id='c-amt'
          value={formAmount}
          onChange={(e) => setFormAmount(e.target.value)}
          className='mt-1'
        />
      </div>
      <div>
        <Label htmlFor='c-max'>Max redemptions (empty = unlimited)</Label>
        <Input
          id='c-max'
          value={formMax}
          onChange={(e) => setFormMax(e.target.value)}
          className='mt-1'
        />
      </div>
      <div>
        <Label htmlFor='c-exp'>Expires at (ISO local, optional)</Label>
        <Input
          id='c-exp'
          value={formExpires}
          onChange={(e) => setFormExpires(e.target.value)}
          placeholder='2026-12-31T23:59:59'
          className='mt-1'
        />
      </div>
      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          id='c-active'
          checked={formActive}
          onChange={(e) => setFormActive(e.target.checked)}
        />
        <Label htmlFor='c-active'>Active</Label>
      </div>
      <div>
        <Label htmlFor='c-extra'>{extraLabel}</Label>
        <Input
          id='c-extra'
          value={extraPlans}
          onChange={(e) => setExtraPlans(e.target.value)}
          className='mt-1'
        />
      </div>
    </div>
  )
}
