'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
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
import { Category } from '@/lib/graphql/types/category'
import { ImagePreview } from '@/components/ImagePreview'
import { ImageUploadArea } from '@/components/ImageUploadArea'

// const UPLOAD_IMAGE = gql`
//   mutation UploadListingImage($image: String!) {
//     uploadListingImage(image: $image)
//   }
// `

const CREATE_LISTING = gql`
  mutation CreateListing(
    $title: String!
    $description: String!
    $images: [String!]!
    $categoryId: ID!
    $price: Float!
    $customCity: String!
    $cityId: ID!
    $condition: Condition!
    $userId: ID!
  ) {
    createListing(
      title: $title
      description: $description
      images: $images
      categoryId: $categoryId
      price: $price
      customCity: $customCity
      cityId: $cityId
      condition: $condition
      userId: $userId
    ) {
      id
      title
      description
      price
      createdAt
    }
  }
`

const GET_CONDITIONS = gql`
  query GetConditions {
    getConditions
  }
`

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`

export default function SellPage() {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)
  const userId = useSelector((state: RootState) => state.auth.user?.userId)

  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    condition: 'NEW',
  })

  const [images, setImages] = useState<string[]>([])

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // const [uploadImage] = useMutation(UPLOAD_IMAGE, {
  //   context: { headers: { Authorization: `Bearer ${token}` } },
  // })

  const [createListing, { loading, error }] = useMutation(CREATE_LISTING, {
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

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
      toast.error('Image upload failed')
      console.error('❌ Upload error:', err)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createListing({
        variables: {
          ...form,
          price: parseFloat(form.price),
          images,
          userId: userId,
        },
      })
      toast.success('Listing created successfully!')
      setForm({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        condition: 'NEW',
      })
      setImages([])
      router.push('/')
    } catch (err) {
      console.error(err)
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
  } = useQuery(GET_CATEGORIES)

  if (!token) {
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

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
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

          <div className='flex flex-col'>
            <Label
              htmlFor='categoryId'
              className='mb-2'
            >
              Category
            </Label>
            {categoriesLoading ? (
              <p>Loading categories...</p>
            ) : categoriesError ? (
              <p>Error loading categories</p>
            ) : (
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
          </div>

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

          <div className='flex flex-col'>
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
            variant='default'
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
