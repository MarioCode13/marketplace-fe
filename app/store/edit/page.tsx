'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { GET_MY_STORE_BRANDING } from '@/lib/graphql/queries/getSellerProfile'
import { GET_STORE_BY_SLUG_FULL } from '@/lib/graphql/queries/getStoreBySlugFull'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoaderCircle, Loader2 } from 'lucide-react'
import { FileInput } from '@/components/ui/fileInput'
import Image from 'next/image'
import PreviewModal from '@/components/modals/PreviewModal'
import { UPDATE_STORE_BRANDING } from '@/lib/graphql/mutations/businessMutations'

export default function EditStorePage() {
  const userId = useSelector((state: RootState) => state.auth.user?.userId)
  const router = useRouter()
  const { data, loading } = useQuery(GET_MY_STORE_BRANDING, {
    variables: { userId },
    skip: !userId,
  })
  const branding = data?.user?.storeBranding
  const planType = data?.user?.planType
  const isProStore = data?.user?.planType === 'PRO_STORE'
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
  const [updateStoreBranding, { loading: saving }] = useMutation(
    UPDATE_STORE_BRANDING,
    {
      refetchQueries: [
        {
          query: GET_STORE_BY_SLUG_FULL,
          variables: { slug: form.slug },
        },
      ],
      awaitRefetchQueries: true,
    }
  )
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadLogoError, setUploadLogoError] = useState<string | null>(null)
  const [uploadBannerError, setUploadBannerError] = useState<string | null>(
    null
  )
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (branding) {
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
      console.log('Loaded branding.lightOrDark:', branding.lightOrDark)
    }
  }, [branding])

  const handleChange = (
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
    console.log('Submitting with lightOrDark:', form.lightOrDark)
    const result = await updateStoreBranding({
      variables: {
        id: userId,
        ...form,
      },
    })
    console.log(
      'Mutation response:',
      result?.data?.updateStoreBranding?.storeBranding?.lightOrDark
    )
    router.push(`/store/${form.slug}`)
  }

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center min-h-[40vh]'>
        <LoaderCircle className='animate-spin text-primary w-10 h-10 mb-4' />
        <span className='text-lg text-gray-600'>Loading store branding...</span>
      </div>
    )
  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Edit Store Branding</h1>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
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
            // 'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            // 'placeholder:text-[var(--muted-foreground)]',
            // ' focus-visible:ring-1 focus-visible:ring-ring',
            // 'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
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
                disabled={planType === 'RESELLER'}
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
              <label className='block font-medium mb-1'>Secondary Color</label>
              <input
                type='color'
                name='secondaryColor'
                value={form.secondaryColor}
                onChange={handleChange}
                disabled={planType === 'RESELLER'}
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
              disabled={planType === 'RESELLER'}
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
          {uploadLogoError && (
            <div className='text-red-500 text-sm mt-1'>{uploadLogoError}</div>
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
          {uploadBannerError && (
            <div className='text-red-500 text-sm mt-1'>{uploadBannerError}</div>
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            type='submit'
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type='button'
            color='secondary'
            onClick={() => router.push(`/store/${branding.slug}`)}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='outlined'
            onClick={() => setShowPreview(true)}
          >
            Preview
          </Button>
        </div>
      </form>
      {showPreview && (
        <PreviewModal
          form={form}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  )
}
