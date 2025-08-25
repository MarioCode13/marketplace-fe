'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter, useParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImagePreview } from '@/components/ImagePreview'
import { ImageUploadArea } from '@/components/ImageUploadArea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { GET_LISTING_BY_ID } from '@/lib/graphql/queries/getListingById'
import { GET_CONDITIONS } from '@/lib/graphql/queries/getConditions'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { UPDATE_LISTING } from '@/lib/graphql/mutations/listingMutations'
import {
  UpdateListingInput,
  useGetCategoriesQuery,
} from '@/lib/graphql/generated'
import CategoryCascader, {
  CategoryNode,
} from '@/components/drawers/CategoryCascader'
import { buildCategoryTree, FlatCategory } from '@/lib/utils'
import CityAutocomplete from '@/components/drawers/CityAutocomplete'

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id as string
  const token = useSelector((state: RootState) => state.auth.token)
  const userId = useSelector((state: RootState) => state.auth.user?.userId)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    cityLabel: '',
    categoryId: '',
    condition: 'NEW',
    customCity: '',
  })

  const [images, setImages] = useState<string[]>([])

  // Fetch listing data
  const {
    data: listingData,
    loading: listingLoading,
    error: listingError,
  } = useQuery(GET_LISTING_BY_ID, {
    variables: { id: listingId },
    skip: !listingId,
  })

  const [showCustomCity, setShowCustomCity] = useState(false)

  // Fetch conditions and categories
  const { data: conditionsData, loading: conditionsLoading } =
    useQuery(GET_CONDITIONS)
  const { data: categoriesData, loading: categoriesLoading } =
    useGetCategoriesQuery()

  // Fetch current user data
  const { data: meData } = useQuery(GET_ME, {
    skip: !token,
  })

  const categoriesTree: CategoryNode[] = useMemo(() => {
    if (!categoriesData?.getCategories) return []
    return buildCategoryTree(categoriesData.getCategories as FlatCategory[])
  }, [categoriesData])

  const [updateListing] = useMutation(UPDATE_LISTING, {
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

  const [formKey, setFormKey] = useState('')

  // Initialize form with listing data
  useEffect(() => {
    if (listingData?.getListingById) {
      const listing = listingData.getListingById
      console.log('Initializing form with listing data:', listing)

      setForm({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        city: listing.city.id || '',
        cityLabel: listing.city.name || '',
        categoryId: listing.category?.id || '',
        condition: listing.condition,
        customCity: listing?.customCity || '',
      })
      setFormKey(listing.id)
      setImages(listing.images || [])
    } else {
      console.warn('No listing data found to initialize the form.')
    }
  }, [listingData?.getListingById])

  // Check if user owns the listing
  useEffect(() => {
    if (listingData?.getListingById && (userId || meData?.me?.id)) {
      const listing = listingData.getListingById
      const currentUserId = meData?.me?.id || userId

      if (String(listing.user.id) !== String(currentUserId)) {
        toast.error('You can only edit your own listings')
        router.push('/my-listings')
      }
    }
  }, [listingData, userId, meData, router])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (file: File) => {
    if (images.length >= 5) return

    setUploading(true)
    const formData = new FormData()
    formData.append('images', file)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/listings/upload-images`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(`Upload failed: ${data}`)
      }

      setImages([...images, data[0]])
      toast.success('Image uploaded successfully!')
    } catch (err) {
      console.error('❌ Upload error:', err)
      toast.error('Failed to upload image')
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const input: UpdateListingInput = {
        id: listingId,
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        images,
        // TODO: fix to use Input
        // condition: form.condition,
        categoryId: form.categoryId,
        cityId: form.city || null,
        customCity: form.customCity || null,
      }

      await updateListing({
        variables: { input },
      })

      toast.success('Listing updated successfully!')
      router.push(`/listings/${listingId}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update listing')
    }

    setSaving(false)
  }

  if (!token) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground text-center'>
          <h1 className='mb-4 text-2xl font-bold text-foreground'>
            Please Log In
          </h1>
          <p className='mb-4 text-foreground'>
            You need to be logged in to edit listings.
          </p>
          <Button
            variant='secondary'
            className='w-full'
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (listingLoading || conditionsLoading || categoriesLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (listingError) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground text-center'>
          <h1 className='mb-4 text-2xl font-bold text-foreground'>Error</h1>
          <p className='mb-4 text-foreground'>
            Failed to load listing: {listingError.message}
          </p>
          <Button
            variant='secondary'
            className='w-full'
            onClick={() => router.push('/my-listings')}
          >
            Back to My Listings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full max-w-2xl py-8 px-6'>
        <div className='flex items-center justify-between gap-4 mb-6'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push(`/listings/${listingId}`)}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Listing
          </Button>
          <h1 className='text-3xl font-bold'>Edit Listing</h1>
          <div className='w-32' />
        </div>

        <div className='bg-componentBackground rounded-lg p-6 shadow-lg'>
          <form
            key={formKey}
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            <div>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                name='title'
                value={form.title}
                onChange={handleChange}
                required
                className='mt-1'
              />
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className='mt-1'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='price'>Price (R)</Label>
                <Input
                  id='price'
                  name='price'
                  min='0'
                  value={form.price}
                  onChange={handleChange}
                  required
                  className='mt-1'
                />
              </div>

              <div>
                {!showCustomCity ? (
                  <CityAutocomplete
                    value={form.city}
                    displayValue={form.cityLabel}
                    onChange={(cityId, cityLabel) => {
                      setForm((prev) => ({
                        ...prev,
                        city: cityId || '',
                        cityLabel: cityLabel || '',
                        customCity: '',
                      }))
                      setShowCustomCity(false)
                    }}
                    onCantFindCity={() => {
                      setForm((prev) => ({ ...prev, city: '', cityLabel: '' }))
                      setShowCustomCity(true)
                    }}
                    label={undefined}
                  />
                ) : (
                  <div className='mt-2'>
                    <Label htmlFor='customCity'>Custom City</Label>
                    <Input
                      id='customCity'
                      name='customCity'
                      value={form.customCity}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          customCity: e.target.value,
                        }))
                      }
                      placeholder='Enter your city'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      className='mt-1 text-xs text-blue-600 underline'
                      onClick={() => setShowCustomCity(false)}
                    >
                      Back to city search
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Category</Label>
                <CategoryCascader
                  categories={categoriesTree as CategoryNode[]}
                  value={form.categoryId}
                  onChange={(id) => setForm({ ...form, categoryId: id })}
                  placeholder='Select a Category'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='condition'>Condition</Label>
                <Select
                  name='condition'
                  value={form.condition}
                  onValueChange={(value) =>
                    setForm({ ...form, condition: value })
                  }
                >
                  <SelectTrigger className='mt-1'>
                    <SelectValue placeholder='Select condition' />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionsData?.getConditions?.map((condition: string) => (
                      <SelectItem
                        key={condition}
                        value={condition}
                      >
                        {condition.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Images ({images.length}/5)</Label>
              <div className='mt-2 space-y-4'>
                <ImageUploadArea
                  onImageUpload={handleImageUpload}
                  loading={uploading}
                  disabled={images.length >= 5}
                  currentImageCount={images.length}
                />

                {images.length > 0 && (
                  <ImagePreview
                    images={images}
                    onRemoveImage={handleRemoveImage}
                    maxImages={5}
                    loading={uploading}
                  />
                )}
              </div>
            </div>

            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push(`/listings/${listingId}`)}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={saving}
                className='flex-1'
              >
                {saving ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
