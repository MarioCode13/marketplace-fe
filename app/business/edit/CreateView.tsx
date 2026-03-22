import CityAutocomplete from '@/components/drawers/CityAutocomplete'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { refetchBusinessContext } from '@/store/userContextSlice'
import { useMutation } from '@apollo/client'
import { CREATE_BUSINESS } from '@/lib/graphql/mutations/businessMutations'

export default function CreateView() {
  const dispatch = useDispatch<AppDispatch>()
  const [createBusiness, { loading: creatingBusiness }] =
    useMutation(CREATE_BUSINESS)

  const [businessForm, setBusinessForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    slug: '',
  })

  const [createCityId, setCreateCityId] = useState<string | undefined>()
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessForm.name?.trim() || !businessForm.email?.trim()) {
      toast.error('Business name and email are required.')
      return
    }
    try {
      const { data } = await createBusiness({
        variables: {
          input: {
            name: businessForm.name.trim(),
            email: businessForm.email.trim(),
            contactNumber: businessForm.contactNumber || undefined,
            addressLine1: businessForm.addressLine1 || undefined,
            addressLine2: businessForm.addressLine2 || undefined,
            cityId: createCityId || undefined,
            postalCode: businessForm.postalCode || undefined,
            slug: businessForm.slug?.trim() || undefined,
          },
        },
      })
      if (data?.createBusiness?.id) {
        toast.success('Business created successfully.')
        dispatch(refetchBusinessContext())
        // Refetch will update businessId; page re-renders and switches to edit mode
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create business.',
      )
    }
  }

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Create your business</h1>
      <p className='text-gray-600 mb-6'>
        Set up your business profile to start selling as a store.
      </p>
      <form
        onSubmit={handleCreateSubmit}
        className='space-y-4 max-w-xl'
      >
        <div>
          <label className='block font-medium mb-1'>Business Name *</label>
          <Input
            name='name'
            value={businessForm.name}
            onChange={(e) =>
              setBusinessForm((f) => ({ ...f, name: e.target.value }))
            }
            placeholder='e.g. My Store'
            required
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Business Email *</label>
          <Input
            name='email'
            type='email'
            value={businessForm.email}
            onChange={(e) =>
              setBusinessForm((f) => ({ ...f, email: e.target.value }))
            }
            placeholder='store@example.com'
            required
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Store Slug (URL)</label>
          <Input
            name='slug'
            value={businessForm.slug}
            onChange={(e) =>
              setBusinessForm((f) => ({ ...f, slug: e.target.value }))
            }
            placeholder='e.g. my-store (optional, auto-generated if blank)'
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Contact Number</label>
          <Input
            name='contactNumber'
            value={businessForm.contactNumber}
            onChange={(e) =>
              setBusinessForm((f) => ({
                ...f,
                contactNumber: e.target.value,
              }))
            }
            placeholder='e.g. +27 11 123 4567'
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Address Line 1</label>
          <Input
            name='addressLine1'
            value={businessForm.addressLine1}
            onChange={(e) =>
              setBusinessForm((f) => ({ ...f, addressLine1: e.target.value }))
            }
            placeholder='Street address'
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Address Line 2</label>
          <Input
            name='addressLine2'
            value={businessForm.addressLine2}
            onChange={(e) =>
              setBusinessForm((f) => ({ ...f, addressLine2: e.target.value }))
            }
            placeholder='Suite, unit, etc. (optional)'
          />
        </div>
        <div>
          <CityAutocomplete
            value={createCityId}
            onChange={(cityId) => setCreateCityId(cityId)}
            label='City'
            placeholder='Search for your city...'
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Postal Code</label>
          <Input
            name='postalCode'
            value={businessForm.postalCode}
            onChange={(e) =>
              setBusinessForm((f) => ({ ...f, postalCode: e.target.value }))
            }
            placeholder='e.g. 2000'
          />
        </div>
        <Button
          type='submit'
          disabled={creatingBusiness}
          color='gradient'
          variant='contained'
        >
          {creatingBusiness ? (
            <Loader2 className='animate-spin w-5 h-5' />
          ) : (
            'Create business'
          )}
        </Button>
      </form>
    </div>
  )
}
