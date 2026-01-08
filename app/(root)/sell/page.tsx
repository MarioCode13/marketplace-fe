'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImagePreview } from '@/components/ImagePreview'
import { ImageUploadArea } from '@/components/ImageUploadArea'
import { useGetCategoriesQuery } from '@/lib/graphql/generated'
import CityAutocomplete from '@/components/drawers/CityAutocomplete'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import CategoryCascader, {
  CategoryNode,
} from '@/components/drawers/CategoryCascader'
import { buildCategoryTree, FlatCategory } from '@/lib/utils'

const CREATE_LISTING = gql`
  mutation CreateListing(
    $title: String!
    $description: String!
    $images: [String!]!
    $categoryId: ID!
    $price: Float!
    $quantity: Int
    $customCity: String
    $cityId: ID
    $condition: Condition!
    $userId: ID!
    $businessId: ID
  ) {
    createListing(
      title: $title
      description: $description
      images: $images
      categoryId: $categoryId
      price: $price
      quantity: $quantity
      customCity: $customCity
      cityId: $cityId
      condition: $condition
      userId: $userId
      businessId: $businessId
    ) {
      id
      title
      description
      price
      quantity
      createdAt
      city {
        name
      }
    }
  }
`

const GET_CONDITIONS = gql`
  query GetConditions {
    getConditions
  }
`

export default function SellPage() {
  const router = useRouter()
  const userContext = useSelector((state: RootState) => state.userContext)
  const userId = userContext.userId
  const { data } = useQuery(GET_ME)
  const user = data?.me
  const [uploading, setUploading] = useState(false)

  // Permission: only users on PRO_STORE plan, business owners, or businesses of type RESELLER
  const canSetQuantity = Boolean(
    userContext?.planType === 'PRO_STORE' ||
      userContext?.isBusinessOwner ||
      userContext?.business?.businessType === 'RESELLER'
  )

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    condition: 'NEW',
    quantity: '',
    city: user?.city?.id || '',
    cityLabel: user?.city
      ? `${user.city.name}, ${user.city.region.name}, ${user.city.region.country.name}`
      : '',
    customCity: user?.customCity || '',
  })
  const [showCustomCity, setShowCustomCity] = useState(false)

  const [images, setImages] = useState<string[]>([])

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const [createListing, { loading, error }] = useMutation(CREATE_LISTING)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (file: File) => {
    if (images.length >= 5) return

    setUploading(true)
    const formData = new FormData()
    formData.append('images', file)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/listings/upload-images`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(`Upload failed: ${data}`)
      }

      setImages([...images, data[0]])
      toast.success('Image uploaded successfully!')
    } catch (err) {
      toast.error('Image upload failed: ' + err)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate quantity if provided
    if (form.quantity) {
      // Must be a non-negative integer
      const intVal = parseInt(form.quantity, 10)
      if (isNaN(intVal) || intVal < 0 || !/^\d+$/.test(form.quantity)) {
        toast.error('Quantity must be a non-negative integer')
        return
      }
      // Prevent unauthorized users from submitting a quantity value
      if (!canSetQuantity) {
        toast.error('You are not allowed to set a quantity for listings')
        return
      }
    }

    try {
      await createListing({
        variables: {
          title: form.title,
          description: form.description,
          images,
          categoryId: form.categoryId,
          price: parseFloat(form.price),
          customCity: form.customCity || undefined,
          cityId: form.city || undefined,
          condition: form.condition,
          userId: userId,
          quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
          businessId: userContext.businessId || undefined,
        },
      })
      toast.success('Listing created successfully!')
      setForm({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        condition: 'NEW',
        quantity: '',
        city: '',
        cityLabel: '',
        customCity: '',
      })
      setImages([])
      router.push('/')
    } catch (err) {
      toast.error('Failed to create listing: ' + (err as Error).message)
    }
  }

  const {
    data: conditionsData,
    loading: conditionsLoading,
    error: conditionsError,
  } = useQuery(GET_CONDITIONS)

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery()

  const categoriesTree: CategoryNode[] = useMemo(() => {
    if (!categoriesData?.getCategories) return []
    // Assume getCategories returns flat array with id, name, parentId
    return buildCategoryTree(categoriesData.getCategories as FlatCategory[])
  }, [categoriesData])

  if (!userId) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground text-center'>
          <h1 className='mb-4 text-2xl font-bold text-foreground'>
            Please Log In
          </h1>
          <p className='mb-4 text-foreground'>
            You need to be logged in to sell items.
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

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground my-8'>
        <h2 className='mb-6 text-2xl font-bold text-foreground'>
          Create a New Listing
        </h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col'>
            <Label
              htmlFor='title'
              className='mb-2'
            >
              Title
            </Label>
            <Input
              id='title'
              name='title'
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col'>
            <Label
              htmlFor='description'
              className='mb-2'
            >
              Description
            </Label>
            <Textarea
              id='description'
              name='description'
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col'>
            <Label
              htmlFor='price'
              className='mb-2'
            >
              Price
            </Label>
            <Input
              id='price'
              name='price'
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          {canSetQuantity && (
            <div className='flex flex-col'>
              <Label
                htmlFor='quantity'
                className='mb-2'
              >
                Quantity
              </Label>
              <Input
                id='quantity'
                name='quantity'
                value={form.quantity}
                onChange={handleChange}
                placeholder='Enter quantity (whole number)'
                type='number'
                min={0}
              />
            </div>
          )}

          {/* <div className='flex flex-col'>
             
             (
              <Select
                value={form.categoryId}
                onValueChange={(value) =>
                  setForm({ ...form, categoryId: value })
                }
                required
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.getCategories.map((category: Category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div> */}
          {categoriesLoading ? (
            <p>Loading categories...</p>
          ) : categoriesError ? (
            <p>Error loading categories</p>
          ) : (
            <div className='space-y-2'>
              <Label>Category</Label>
              <CategoryCascader
                categories={categoriesTree as CategoryNode[]}
                value={form.categoryId}
                onChange={(id) => setForm({ ...form, categoryId: id })}
                placeholder='Select a Category'
              />
            </div>
          )}

          <div className='flex flex-col mb-1'>
            <Label
              htmlFor='condition'
              className='mb-2'
            >
              Condition
            </Label>
            {conditionsLoading ? (
              <p>Loading...</p>
            ) : conditionsError ? (
              <p>Error loading conditions</p>
            ) : (
              <Select
                value={form.condition}
                onValueChange={(value) =>
                  setForm({ ...form, condition: value })
                }
                required
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Condition' />
                </SelectTrigger>
                <SelectContent>
                  {conditionsData?.getConditions.map((condition: string) => (
                    <SelectItem
                      key={condition}
                      value={condition}
                    >
                      {condition.charAt(0) + condition.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
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
            {showCustomCity && (
              <div className='mt-2'>
                <Label htmlFor='customCity'>Custom City</Label>
                <Input
                  id='customCity'
                  name='customCity'
                  value={form.customCity}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, customCity: e.target.value }))
                  }
                  placeholder='Enter your city'
                />
                <Button
                  type='button'
                  variant='text'
                  className='mt-1 text-xs text-blue-600 underline'
                  onClick={() => setShowCustomCity(false)}
                >
                  Back to city search
                </Button>
              </div>
            )}
          </div>

          <div
            className='flex flex-col'
            data-testid='image-upload-area'
            data-disabled={images.length >= 5}
          >
            <Label className='mb-2'>Images</Label>
            <ImageUploadArea
              onImageUpload={handleImageUpload}
              loading={uploading}
              disabled={images.length >= 5}
              maxImages={5}
              currentImageCount={images.length}
            />
          </div>
          {/* Image Preview */}
          <ImagePreview
            images={images}
            onRemoveImage={handleRemoveImage}
            maxImages={5}
            loading={uploading}
          />
          {error && (
            <p className='text-sm text-red-500 text-center'>{error.message}</p>
          )}

          <Button
            type='submit'
            variant='contained'
            className='w-full'
            disabled={loading || uploading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </Button>
        </form>
      </div>
    </div>
  )
}
