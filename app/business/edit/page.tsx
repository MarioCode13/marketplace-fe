'use client'
import { useApolloClient } from '@apollo/client'
import { checkSlugAvailable } from '@/lib/utils/slugUtils'

import { useQuery, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { RootState } from '@/store/store'
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
import { Loader2, LoaderCircle, Users } from 'lucide-react'

import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { UPDATE_STORE_BRANDING } from '@/lib/graphql/mutations/businessMutations'
import { BusinessUser } from '@/lib/graphql/generated'

export default function BusinessEditPage() {
  const userId = useSelector((state: RootState) => state.auth.user?.userId)
  const router = useRouter()

  const client = useApolloClient()
  const [slugFocused, setSlugFocused] = useState(false)
  const [slugValid, setSlugValid] = useState(true)
  const [slugWarning, setSlugWarning] = useState<string | null>(null)
  const [slugLoading, setSlugLoading] = useState(false)

  // Get business data
  const { data, loading } = useQuery(GET_MY_BUSINESS, {
    skip: !userId,
  })

  const business = data?.myBusiness
  const planType = data?.myBusiness?.storeBranding ? 'PRO_STORE' : 'FREE' // This should come from user data
  const isProStore = planType === 'PRO_STORE'

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    email: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    cityId: '',
    postalCode: '',
  })

  // Branding form state
  const [form, setForm] = useState({
    storeName: '',
    about: '',
    themeColor: '#000000',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    lightOrDark: 'dark',
    logoUrl: '',
    bannerUrl: '',
    slug: '',
  })

  const [updateBusinessAndBranding, { loading: saving }] = useMutation(
    UPDATE_STORE_BRANDING
  )

  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadLogoError, setUploadLogoError] = useState<string | null>(null)
  const [uploadBannerError, setUploadBannerError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (business) {
      setBusinessForm({
        email: business.email || '',
        contactNumber: business.contactNumber || '',
        addressLine1: business.addressLine1 || '',
        addressLine2: business.addressLine2 || '',
        cityId: business.city?.id?.toString() || '',
        postalCode: business.postalCode || '',
      })
    }

    if (business?.storeBranding) {
      const branding = business.storeBranding
      setForm({
        storeName: branding.storeName || '',
        about: branding.about || '',
        themeColor: branding.themeColor || '#000000',
        primaryColor: branding.primaryColor || '#000000',
        secondaryColor: branding.secondaryColor || '#ffffff',
        lightOrDark: branding.lightOrDark || 'light',
        logoUrl: branding.logoUrl || '',
        bannerUrl: branding.bannerUrl || '',
        slug: branding.slug || '',
      })
    }
  }, [business])

  const handleBusinessChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBusinessForm({ ...businessForm, [e.target.name]: e.target.value })
  }

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === 'slug') {
      setSlugLoading(true)
      const result = await checkSlugAvailable(e.target.value, client)
      setSlugValid(result.valid)
      setSlugWarning(result.reason || null)
      setSlugLoading(false)
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, themeColor: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, lightOrDark: value }))
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

    if (!business) {
      console.error('No business found')
      return
    }

    try {
      await updateBusinessAndBranding({
        variables: {
          business: {
            businessId: business.id,
            email: businessForm.email,
            contactNumber: businessForm.contactNumber,
            addressLine1: businessForm.addressLine1,
            addressLine2: businessForm.addressLine2,
            cityId: businessForm.cityId ? parseInt(businessForm.cityId) : null,
            postalCode: businessForm.postalCode,
          },
          branding: {
            slug: form.slug,
            logoUrl: form.logoUrl,
            bannerUrl: form.bannerUrl,
            themeColor: form.themeColor,
            primaryColor: form.primaryColor,
            secondaryColor: form.secondaryColor,
            lightOrDark: form.lightOrDark,
            about: form.about,
            storeName: form.storeName,
          },
        },
      })

      router.push(`/store/${form.slug}`)
    } catch (error) {
      console.error('Error updating business:', error)
    }
  }

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center min-h-[40vh]'>
        <LoaderCircle className='animate-spin text-primary w-10 h-10 mb-4' />
        <span className='text-lg text-gray-600'>
          Loading business settings...
        </span>
      </div>
    )

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
      <h1 className='text-2xl font-bold mb-4'>Business Settings</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Business Details */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Business Details</h2>
            <div>
              <label className='block font-medium mb-1'>Business Name</label>
              <Input
                value={business.name}
                disabled
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Business Email</label>
              <Input
                name='email'
                value={businessForm.email}
                onChange={handleBusinessChange}
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Contact Number</label>
              <Input
                name='contactNumber'
                value={businessForm.contactNumber}
                onChange={handleBusinessChange}
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Address Line 1</label>
              <Input
                name='addressLine1'
                value={businessForm.addressLine1}
                onChange={handleBusinessChange}
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Address Line 2</label>
              <Input
                name='addressLine2'
                value={businessForm.addressLine2}
                onChange={handleBusinessChange}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block font-medium mb-1'>City</label>
                <Input
                  name='cityId'
                  value={businessForm.cityId}
                  onChange={handleBusinessChange}
                  placeholder='City ID'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>Postal Code</label>
                <Input
                  name='postalCode'
                  value={businessForm.postalCode}
                  onChange={handleBusinessChange}
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
              <label className='block font-medium mb-1'>Store Slug (URL)</label>
              <Input
                name='slug'
                value={form.slug}
                onChange={handleChange}
                required
                placeholder='e.g. my-cool-store'
                onFocus={() => setSlugFocused(true)}
                onBlur={() => setSlugFocused(false)}
              />
              {slugFocused && (
                <div className='text-xs mt-1'>
                  <span className='text-yellow-700'>
                    <strong>SEO Tip:</strong> Choose a short, memorable, and
                    relevant slug for your store URL. Avoid spaces and special
                    characters. Good slugs help your store appear higher in
                    search results.
                    <br />
                    <strong>Warning:</strong> Changing your slug after your
                    store is live may affect your search engine ranking and
                    break existing links to your store. Only change it if
                    absolutely necessary.
                  </span>
                  {slugLoading && (
                    <span className='text-gray-500 ml-2'>
                      Checking availability...
                    </span>
                  )}
                  {!slugLoading && slugWarning && (
                    <span className='block text-red-600 mt-1'>
                      {slugWarning}
                    </span>
                  )}
                </div>
              )}
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
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {isProStore && (
                <div>
                  <label className='block font-medium mb-1'>Theme Color</label>
                  <input
                    type='color'
                    name='themeColor'
                    value={form.themeColor}
                    onChange={handleColorChange}
                  />
                </div>
              )}
              <div>
                <label className='block font-medium mb-1'>Primary Color</label>
                <input
                  type='color'
                  name='primaryColor'
                  value={form.primaryColor}
                  onChange={handleChange}
                />
              </div>
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
            color='secondary'
            onClick={() => router.push(`/store/${form.slug}`)}
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
          <Button
            variant='outlined'
            disabled
          >
            Add team member (coming soon)
          </Button>
        </div>
      </div>
    </div>
  )
}
