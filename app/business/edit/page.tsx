'use client'
import { useDispatch } from 'react-redux'
import { setUserContext } from '@/store/userContextSlice'
import { gql, useLazyQuery } from '@apollo/client'

import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileInput } from '@/components/ui/fileInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Users, Eye } from 'lucide-react'
import { UPDATE_STORE_BRANDING } from '@/lib/graphql/mutations/businessMutations'
import { UPDATE_BUSINESS } from '@/lib/graphql/mutations/updateBusiness'
import { BusinessUser, UpdateStoreBrandingInput } from '@/lib/graphql/generated'
import PreviewModal from '@/components/modals/PreviewModal'
import Link from 'next/link'
import AddTeamMember from './AddTeamMember'

export default function BusinessEditPage() {
  const router = useRouter()

  const user = useSelector((state: RootState) => state.auth.user)
  const userContext = useSelector((state: RootState) => state.userContext)
  const business = userContext.business
  const dispatch = useDispatch()
  const userId = user?.id
  // Fix user type usage (ensure planType and role exist on user)
  // Use userContext for business role and planType if available
  const userPlanType = userContext.business?.owner?.planType || undefined
  const isProStore = userPlanType === 'PRO_STORE'
  // If user or business is missing, fallback to query (optional)
  // You can add logic here to query if store is empty

  // Check if user can edit business details (admin or business owner)
  const canEditBusiness = business?.businessUsers?.some(
    (bu: BusinessUser) => bu.user.id === userId && bu.role === 'OWNER'
  )

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    slug: '',
  })

  const [slugWarning, setSlugWarning] = useState<string | null>(null)
  const [slugLoading, setSlugLoading] = useState(false)
  const [slugValid, setSlugValid] = useState(true)

  // Slug availability query
  const IS_STORE_SLUG_AVAILABLE = gql`
    query IsStoreSlugAvailable($slug: String!) {
      isStoreSlugAvailable(slug: $slug)
    }
  `
  const [checkSlugAvailable] = useLazyQuery(IS_STORE_SLUG_AVAILABLE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.isStoreSlugAvailable) {
        setSlugWarning(null)
        setSlugValid(true)
      } else {
        setSlugWarning('This slug is already in use.')
        setSlugValid(false)
      }
      setSlugLoading(false)
    },
    onError: () => {
      setSlugWarning('Error checking slug availability.')
      setSlugValid(false)
      setSlugLoading(false)
    },
  })

  // Branding form state
  const [form, setForm] = useState({
    storeName: '',
    about: '',
    themeColor: '#000000',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    backgroundColor: '#f8f9fa',
    textColor: '#000000',
    cardTextColor: '#000000',
    lightOrDark: 'dark',
    logoUrl: '',
    bannerUrl: '',
  })

  const [showPreview, setShowPreview] = useState(false)

  const [updateStoreBranding, { loading: brandingSaving }] = useMutation(
    UPDATE_STORE_BRANDING
  )
  const [updateBusiness, { loading: businessSaving }] =
    useMutation(UPDATE_BUSINESS)
  const saving = brandingSaving || businessSaving

  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadLogoError, setUploadLogoError] = useState<string | null>(null)
  const [uploadBannerError, setUploadBannerError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (business?.storeBranding) {
      const branding = business.storeBranding
      setForm({
        storeName: branding.storeName || '',
        about: branding.about || '',
        themeColor: branding.themeColor || '#000000',
        primaryColor: branding.primaryColor || '#000000',
        secondaryColor: branding.secondaryColor || '#ffffff',
        backgroundColor: branding.backgroundColor || '#f8f9fa',
        textColor: branding.textColor || '#000000',
        cardTextColor: branding.cardTextColor || '#000000',
        lightOrDark: branding.lightOrDark || 'light',
        logoUrl: branding.logoUrl || '',
        bannerUrl: branding.bannerUrl || '',
      })
    }
  }, [business])

  // Populate business form
  useEffect(() => {
    if (business) {
      setBusinessForm({
        name: business.name || '',
        email: business.email || '',
        contactNumber: business.contactNumber || '',
        addressLine1: business.addressLine1 || '',
        addressLine2: business.addressLine2 || '',
        postalCode: business.postalCode || '',
        slug: business.slug || '',
      })
    }
  }, [business])

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, themeColor: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, lightOrDark: value }))
  }

  const handleBusinessChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setBusinessForm({ ...businessForm, [name]: value })
    if (name === 'slug') {
      setSlugLoading(true)
      setSlugWarning(null)
      setSlugValid(false)
      if (business && value && value !== business.slug) {
        checkSlugAvailable({ variables: { slug: value } })
      } else {
        setSlugLoading(false)
        setSlugWarning(null)
        setSlugValid(true)
      }
    }
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingLogo(true)
      setUploadLogoError(null)
      const formData = new FormData()
      formData.append('image', e.target.files[0])
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/store/upload-logo`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        )
        if (!res.ok) throw new Error('Failed to upload logo')
        const url = await res.text()
        setForm((prev) => ({ ...prev, logoUrl: url }))
      } catch (err: unknown) {
        setUploadLogoError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploadingLogo(false)
      }
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingBanner(true)
      setUploadBannerError(null)
      const formData = new FormData()
      formData.append('image', e.target.files[0])
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/store/upload-banner`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        )
        if (!res.ok) throw new Error('Failed to upload banner')
        const url = await res.text()
        setForm((prev) => ({ ...prev, bannerUrl: url }))
      } catch (err: unknown) {
        setUploadBannerError(
          err instanceof Error ? err.message : 'Upload failed'
        )
      } finally {
        setUploadingBanner(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast.error('User ID not found. Please refresh the page.')
      return
    }

    if (!business?.id) {
      toast.error('Business not found. Please refresh the page.')
      return
    }

    try {
      // 1. Update business details if changed and allowed
      let updatedBusiness = business
      if (canEditBusiness) {
        const businessChanged =
          businessForm.name !== (business.name || '') ||
          businessForm.email !== (business.email || '') ||
          businessForm.contactNumber !== (business.contactNumber || '') ||
          businessForm.addressLine1 !== (business.addressLine1 || '') ||
          businessForm.addressLine2 !== (business.addressLine2 || '') ||
          businessForm.postalCode !== (business.postalCode || '')

        if (businessChanged || businessForm.slug !== (business.slug || '')) {
          const { data: updated } = await updateBusiness({
            variables: {
              input: {
                businessId: business.id,
                email: businessForm.email,
                contactNumber: businessForm.contactNumber,
                addressLine1: businessForm.addressLine1,
                addressLine2: businessForm.addressLine2,
                postalCode: businessForm.postalCode,
                slug: businessForm.slug,
              },
            },
          })
          if (updated?.updateBusiness) {
            updatedBusiness = updated.updateBusiness
          }
        }
      }

      // 2. Update store branding (no slug)
      const brandingInput: Partial<UpdateStoreBrandingInput> = {
        logoUrl: form.logoUrl,
        bannerUrl: form.bannerUrl,
        themeColor: form.themeColor,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        backgroundColor: form.backgroundColor,
        textColor: form.textColor,
        cardTextColor: form.cardTextColor,
        lightOrDark: form.lightOrDark,
        about: form.about,
        storeName: form.storeName,
      }
      const { data: brandingUpdated } = await updateStoreBranding({
        variables: {
          businessId: String(business.id),
          input: brandingInput,
        },
      })
      if (brandingUpdated?.updateStoreBranding) {
        updatedBusiness = {
          ...updatedBusiness,
          storeBranding: brandingUpdated.updateStoreBranding,
        }
      }

      // Update Redux userContext with new business data
      dispatch(setUserContext({ business: updatedBusiness }))

      toast.success('Changes saved successfully!')
      // Redirect based on plan type
      const redirectUrl = isProStore
        ? `/${updatedBusiness.slug}`
        : `/store/${updatedBusiness.id}`
      router.push(redirectUrl)
    } catch (error) {
      toast.error(
        'Failed to save changes. Please try again. ' + (error as Error).message
      )
    }
  }

  if (!business) {
    return (
      <div className='max-w-5xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-4'>Business Settings</h1>
        <div className='text-center py-8'>
          <p className='text-lg text-gray-600 mb-4'>
            No business found. Create one to get started.
          </p>
          <Button onClick={() => router.push('/business/create')}>
            Create Business
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-2'>Business Settings</h1>
      <p className='text-gray-600 mb-6'>
        Manage your business details and store branding.
        {canEditBusiness
          ? ' You can edit both business information and store branding as an admin/owner.'
          : ' You can edit store branding. Business details require admin/owner permissions.'}
      </p>

      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Business Details */}
          <div className='space-y-4'>
            <div>
              <label className='block font-medium mb-1'>Store Slug (URL)</label>
              <Input
                name='slug'
                value={businessForm.slug}
                onChange={handleBusinessChange}
                disabled={!canEditBusiness}
                required
                placeholder='e.g. my-cool-store'
              />
              {slugLoading && (
                <span className='text-xs text-gray-500 ml-2'>
                  Checking availability...
                </span>
              )}
              {!slugLoading && slugWarning && (
                <span className='block text-red-600 text-xs mt-1'>
                  {slugWarning}
                </span>
              )}
              {!slugLoading && slugValid && businessForm.slug && (
                <span className='block text-green-600 text-xs mt-1'>
                  Slug is available!
                </span>
              )}
            </div>
            <h2 className='text-xl font-semibold'>Business Details</h2>
            {!canEditBusiness && (
              <p className='text-sm text-gray-600 mb-4'>
                Only business owners and admins can edit business details.
              </p>
            )}
            <div>
              <label className='block font-medium mb-1'>Business Name</label>
              <Input
                name='name'
                value={businessForm.name}
                onChange={handleBusinessChange}
                disabled={!canEditBusiness}
                placeholder='Enter business name'
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Business Email</label>
              <Input
                name='email'
                type='email'
                value={businessForm.email}
                onChange={handleBusinessChange}
                disabled={!canEditBusiness}
                placeholder='Enter business email'
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Contact Number</label>
              <Input
                name='contactNumber'
                value={businessForm.contactNumber}
                onChange={handleBusinessChange}
                disabled={!canEditBusiness}
                placeholder='Enter contact number'
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Address Line 1</label>
              <Input
                name='addressLine1'
                value={businessForm.addressLine1}
                onChange={handleBusinessChange}
                disabled={!canEditBusiness}
                placeholder='Enter address line 1'
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Address Line 2</label>
              <Input
                name='addressLine2'
                value={businessForm.addressLine2}
                onChange={handleBusinessChange}
                disabled={!canEditBusiness}
                placeholder='Enter address line 2 (optional)'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block font-medium mb-1'>City</label>
                <Input
                  value={business.city?.name || ''}
                  disabled
                  placeholder='City (read-only)'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>Postal Code</label>
                <Input
                  name='postalCode'
                  value={businessForm.postalCode}
                  onChange={handleBusinessChange}
                  disabled={!canEditBusiness}
                  placeholder='Enter postal code'
                />
              </div>
            </div>
          </div>

          {/* Store Branding */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Store Branding</h2>
            <div>
              <label className='block font-medium mb-1'>Store Name</label>
              <Input
                name='storeName'
                value={form.storeName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className='block font-medium mb-1'>About</label>
              <textarea
                name='about'
                value={form.about}
                onChange={handleChange}
                rows={3}
                className='w-full p-2 flex rounded-sm border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <label className='block font-medium mb-1'>
                  Background Color
                </label>
                <input
                  type='color'
                  name='backgroundColor'
                  value={form.backgroundColor}
                  onChange={handleChange}
                  className='w-full h-10 rounded border border-input'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>Primary Color</label>
                <input
                  type='color'
                  name='primaryColor'
                  value={form.primaryColor}
                  onChange={handleChange}
                  className='w-full h-10 rounded border border-input'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>Text Color</label>
                <input
                  type='color'
                  name='textColor'
                  value={form.textColor}
                  onChange={handleChange}
                  className='w-full h-10 rounded border border-input'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>
                  Card Text Color
                </label>
                <input
                  type='color'
                  name='cardTextColor'
                  value={form.cardTextColor}
                  onChange={handleChange}
                  className='w-full h-10 rounded border border-input'
                />
              </div>
              {isProStore && (
                <div>
                  <label className='block font-medium mb-1'>Theme Color</label>
                  <input
                    type='color'
                    name='themeColor'
                    value={form.themeColor}
                    onChange={handleColorChange}
                    className='w-full h-10 rounded border border-input'
                  />
                </div>
              )}
              {isProStore && (
                <div>
                  <label className='block font-medium mb-1'>
                    Secondary Color
                  </label>
                  <input
                    type='color'
                    name='secondaryColor'
                    value={form.secondaryColor}
                    onChange={handleChange}
                    className='w-full h-10 rounded border border-input'
                  />
                </div>
              )}
            </div>
            {isProStore && (
              <div>
                <label className='block font-medium mb-1'>
                  Light or Dark Theme
                </label>
                <Select
                  key={form.lightOrDark}
                  name='lightOrDark'
                  value={form.lightOrDark}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select theme' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className='block font-medium mb-1'>Logo</label>
              <FileInput
                accept='image/*'
                onChange={handleLogoChange}
                loading={uploadingLogo}
                id='logo-upload'
                disabled={uploadingLogo}
              />
              {uploadingLogo && (
                <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
                  <Loader2 className='animate-spin w-4 h-4' />
                </div>
              )}
              {form.logoUrl && !uploadLogoError && (
                <Image
                  src={form.logoUrl}
                  alt='Logo'
                  width={90}
                  height={90}
                  className='w-20 h-20 rounded-full object-cover mt-2'
                />
              )}
            </div>
            {isProStore && (
              <div>
                <label className='block font-medium mb-1'>Banner</label>
                <FileInput
                  accept='image/*'
                  onChange={handleBannerChange}
                  loading={uploadingBanner}
                  id='banner-upload'
                  disabled={uploadingBanner}
                />
                {uploadingBanner && (
                  <div className='flex items-center gap-2 text-sm text-gray-500 mt-2'>
                    <Loader2 className='animate-spin w-4 h-4' />
                  </div>
                )}
                {form.bannerUrl && !uploadBannerError && (
                  <Image
                    src={form.bannerUrl}
                    alt='Banner'
                    width={1000}
                    height={200}
                    className='h-24 mt-2 w-full object-cover'
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            type='submit'
            disabled={saving || !slugValid}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type='button'
            variant='outlined'
            onClick={() => setShowPreview(true)}
          >
            <Eye className='w-4 h-4 mr-2' />
            Preview
          </Button>
          <Button
            type='button'
            color='secondary'
            onClick={() => {
              const cancelUrl = isProStore
                ? `/${business.slug}`
                : `/store/${business.id}`
              router.push(cancelUrl)
            }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Team management */}
      <div className='mt-10 p-4 border rounded-md'>
        <div className='flex items-center gap-2 mb-2'>
          <Users className='w-5 h-5' />
          <h2 className='text-xl font-semibold'>Team</h2>
        </div>
        <p className='text-sm text-muted-foreground mb-4'>
          Invite and manage users who can create listings for this business.
          Only the owner can change business details.
        </p>

        {business.businessUsers && business.businessUsers.length > 0 && (
          <div className='space-y-2'>
            {business.businessUsers.map((businessUser: BusinessUser) => (
              <div
                key={businessUser.id}
                className='flex items-center justify-between p-2 border rounded'
              >
                <div>
                  <span className='font-medium'>
                    {businessUser.user.username}
                  </span>
                  <span className='text-sm text-gray-500 ml-2'>
                    ({businessUser.role})
                  </span>
                </div>
                {businessUser.role !== 'OWNER' && (
                  <Button
                    variant='outlined'
                    size='sm'
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className='mt-4'>
          {isProStore ? (
            <AddTeamMember businessId={business?.id} />
          ) : (
            <>
              <Button
                variant='outlined'
                disabled
              >
                Add team member (Pro Store only)
              </Button>
              <div className='mt-4 flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-r from-slate-800 to-purple-800 border border-purple-900 shadow-sm'>
                <div className='flex items-center justify-center mb-2'>
                  <svg
                    width='32'
                    height='32'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='text-white mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span className='font-bold text-lg text-white'>
                    Unlock Team Management
                  </span>
                </div>
                <div className='text-sm text-white mb-3'>
                  Upgrade to <span className='font-semibold'>Pro Store</span> to
                  add and manage team members, unlock advanced features, and
                  grow your business.
                </div>
                <Link
                  href='/subscriptions'
                  className='inline-block px-4 py-2 bg-primary text-white rounded shadow hover:bg-primaryHover transition font-semibold'
                >
                  Upgrade Now
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          form={{
            ...form,
            bannerUrl: isProStore ? form.bannerUrl : '',
          }}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  )
}
