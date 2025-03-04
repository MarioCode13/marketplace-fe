'use client'

import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'

const CREATE_LISTING = gql`
  mutation CreateListing($input: ListingInput!) {
    createListing(input: $input) {
      id
      title
      description
      price
      createdAt
    }
  }
`

export default function SellPage() {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
  })

  const [createListing, { loading, error }] = useMutation(CREATE_LISTING, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createListing({
        variables: { input: { ...form, price: parseFloat(form.price) } },
      })
      toast.success('Listing created successfully!')
      setForm({ title: '', description: '', price: '' })
      router.push('/listings') // Redirect to listings page after success
    } catch (err) {
      console.error(err)
    }
  }

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
              placeholder='Enter item title'
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
              placeholder='Enter item description'
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
              type='number'
              name='price'
              placeholder='Enter price'
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className='text-sm text-red-500 text-center'>{error.message}</p>
          )}

          <div className='space-y-3'>
            <Button
              type='submit'
              variant='default'
              className='w-full'
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
            <Button
              type='button'
              variant='secondary'
              className='w-full'
              onClick={() => router.push('/listings')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
