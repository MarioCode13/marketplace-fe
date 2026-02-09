'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { GET_CONDITIONS } from '@/lib/graphql/queries/getConditions'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { UPDATE_LISTING } from '@/lib/graphql/mutations/listingMutations'
import {
  Condition,
  UpdateListingInput,
  useGetCategoriesQuery,
} from '@/lib/graphql/generated'
import CategoryCascader, {
  CategoryNode,
} from '@/components/drawers/CategoryCascader'
import { buildCategoryTree, FlatCategory, formatEnum } from '@/lib/utils'
import CityAutocomplete from '@/components/drawers/CityAutocomplete'
import { listingSchema, type ListingFormData } from '@/lib/validation'

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id as string
  const userContext = useSelector((state: RootState) => state.userContext)
  const userId = userContext.userId

  const { data: myBusinessData } = useQuery(GET_MY_BUSINESS)
  const isBusinessUser = !!myBusinessData?.myBusiness
  const businessId = myBusinessData?.myBusiness?.id

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [cityState, setCityState] = useState({
    city: '',
    cityLabel: '',
    customCity: '',
  })

  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      categoryId: '',
      condition: 'NEW',
      quantity: '',
      customCity: '',
    },
  })

  const {
    data: listingData,
    loading: listingLoading,
    error: listingError,
  } = useQuery(GET_LISTING_BY_ID, {
    variables: { id: listingId },
    skip: !listingId,
  })

  const [showCustomCity, setShowCustomCity] = useState(false)

  const { data: conditionsData, loading: conditionsLoading } =
    useQuery(GET_CONDITIONS)
  const { data: categoriesData, loading: categoriesLoading } =
    useGetCategoriesQuery()

  const { data: meData } = useQuery(GET_ME)

  const categoriesTree: CategoryNode[] = useMemo(() => {
    if (!categoriesData?.getCategories) return []
    return buildCategoryTree(categoriesData.getCategories as FlatCategory[])
  }, [categoriesData])

  const [updateListing] = useMutation(UPDATE_LISTING)

  const [formKey, setFormKey] = useState('')

  // Initialise
  useEffect(() => {
    if (!listingData?.getListingById) return

    if (!formKey) {
      const listing = listingData.getListingById

      setValue('title', listing.title)
      setValue('description', listing.description)
      setValue('price', listing.price.toString())
      setValue('quantity', listing.quantity?.toString() || '')
      setValue('categoryId', listing.category?.id || '')
      setValue('condition', listing.condition)
      setValue('customCity', listing?.customCity || '')

      setCityState({
        city: listing.city?.id || '',
        cityLabel: listing.city?.name || '',
        customCity: listing?.customCity || '',
      })

      setFormKey(listing.id)
      setImages(listing.images || [])

      setShowCustomCity(!!listing.customCity)
    }
  }, [listingData?.getListingById, formKey, setValue])

  // Check if user owns listing
  useEffect(() => {
    if (
      listingData?.getListingById &&
      (userId || meData?.me?.id || businessId)
    ) {
      const listing = listingData.getListingById
      const currentUserId = meData?.me?.id || userId

      // If business listing, check business ownership
      if (isBusinessUser && listing.business?.id) {
        if (String(listing.business.id) !== String(businessId)) {
          toast.error('You can only edit your business listings')
          router.push('/my-listings')
        }
      } else if (
        listing.user &&
        String(listing.user.id) !== String(currentUserId)
      ) {
        toast.error('You can only edit your own listings')
        router.push('/my-listings')
      }
    }
  }, [listingData, userId, meData, router, businessId, isBusinessUser])

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const part = parts.pop()
      if (part) return part.split(';').shift()
    }
    return undefined
  }

  const handleImageUpload = async (file: File) => {
    if (images.length >= 5) return

    setUploading(true)
    const formData = new FormData()
    formData.append('images', file)
    const xsrfToken = getCookie('XSRF-TOKEN')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/listings/upload-images`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
          },
        },
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(`Upload failed: ${data}`)
      }

      setImages([...images, data[0]])
      toast.success('Image uploaded successfully!')
    } catch (err) {
      toast.error('❌ Failed to upload image: ' + (err as Error).message)
    }
    setUploading(false)
  }

  const onSubmit = async (formData: ListingFormData) => {
    setSaving(true)

    try {
      const input: UpdateListingInput = {
        id: listingId,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        images,
        condition: formData.condition as Condition,
        categoryId: formData.categoryId.toString(),
        cityId: cityState.city || null,
        customCity: cityState.customCity || null,
        quantity: formData.quantity
          ? parseInt(formData.quantity, 10)
          : undefined,
      }

      await updateListing({
        variables: { input },
      })

      toast.success('Listing updated successfully!')
      router.push(`/listings/${listingId}`)
    } catch (err) {
      toast.error('Failed to update listing: ' + (err as Error).message)
    }

    setSaving(false)
  }

  if (!userId) {
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
            color='secondary'
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
            color='secondary'
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
            variant='text'
            size='sm'
            onClick={() => router.push(`/listing/${listingId}`)}
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
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                placeholder='Enter listing title'
                {...register('title')}
                className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Describe your item'
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='price'>Price (R)</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  placeholder='Enter price'
                  {...register('price')}
                  className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                {!showCustomCity ? (
                  <CityAutocomplete
                    value={cityState.city}
                    displayValue={cityState.cityLabel}
                    onChange={(cityId, cityLabel) => {
                      setCityState((prev) => ({
                        ...prev,
                        city: cityId || '',
                        cityLabel: cityLabel || '',
                        customCity: '',
                      }))
                      setShowCustomCity(false)
                    }}
                    onCantFindCity={() => {
                      setCityState((prev) => ({
                        ...prev,
                        city: '',
                        cityLabel: '',
                      }))
                      setShowCustomCity(true)
                    }}
                    label={undefined}
                  />
                ) : (
                  <div>
                    <Label htmlFor='customCity'>Custom City</Label>
                    <Input
                      id='customCity'
                      className={`mt-1 ${errors.customCity ? 'border-red-500' : ''}`}
                      placeholder='Enter your city'
                      {...register('customCity')}
                      onChange={(e) =>
                        setCityState((prev) => ({
                          ...prev,
                          customCity: e.target.value,
                        }))
                      }
                    />
                    {errors.customCity && (
                      <p className='text-sm text-red-500 mt-1'>
                        {errors.customCity.message}
                      </p>
                    )}
                    <Button
                      type='button'
                      variant='text'
                      size={'sm'}
                      className='  text-xs mt-2'
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
                  value={watch('categoryId')}
                  onChange={(id) => {
                    setValue('categoryId', id)
                  }}
                  placeholder='Select a Category'
                />
                {errors.categoryId && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='condition'>Condition</Label>
                <Select
                  value={watch('condition')}
                  onValueChange={(value) => {
                    setValue('condition', value)
                  }}
                >
                  <SelectTrigger
                    id='condition'
                    className='mt-1'
                  >
                    <SelectValue placeholder='Select condition' />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionsData?.getConditions?.map((condition: string) => (
                      <SelectItem
                        key={condition}
                        value={condition}
                      >
                        {formatEnum(condition)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.condition.message}
                  </p>
                )}
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
                variant='outlined'
                onClick={() => router.push(`/listings/${listingId}`)}
                className='flex-1'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant={'contained'}
                disabled={
                  saving || isSubmitting || Object.keys(errors).length > 0
                }
                className='flex-1'
              >
                {saving || isSubmitting ? (
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
