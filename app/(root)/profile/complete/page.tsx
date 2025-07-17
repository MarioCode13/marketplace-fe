'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Upload, Check, Loader2 } from 'lucide-react'
import CityAutocomplete from '@/components/drawers/CityAutocomplete'

const GET_PROFILE = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      bio
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      contactNumber
      profileImageUrl
      idPhotoUrl
      driversLicenseUrl
      proofOfAddressUrl
    }
  }
`

const COMPLETE_PROFILE = gql`
  mutation CompleteProfile(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $bio: String
    $cityId: ID
    $customCity: String
    $contactNumber: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      cityId: $cityId
      customCity: $customCity
      contactNumber: $contactNumber
    ) {
      id
    }
  }
`

export default function CompleteProfilePage() {
  //   const router = useRouter()
  const { loading, error, data, refetch } = useQuery(GET_PROFILE)
  const [completeProfile] = useMutation(COMPLETE_PROFILE)
  const user = data?.me
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    city: user?.city?.id || '', // store cityId
    cityLabel: user?.city
      ? `${user.city.name}, ${user.city.region.name}, ${user.city.region.country.name}`
      : '',
    customCity: user?.customCity || '',
    contactNumber: user?.contactNumber || '',
  })
  const [uploading, setUploading] = useState({
    profile: false,
    id: false,
    license: false,
    address: false,
  })
  const [showCustomCity, setShowCustomCity] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        city: user.city?.id || '',
        cityLabel: user.city
          ? `${user.city.name}, ${user.city.region.name}, ${user.city.region.country.name}`
          : '',
        customCity: user.customCity || '',
        contactNumber: user.contactNumber || '',
      })
      setShowCustomCity(!!user.customCity)
    }
  }, [user])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading profile</p>

  // Completion logic
  // Debug log for location fields
  console.log('form.city:', form.city, 'form.customCity:', form.customCity)
  // Robust location check: true if city is a non-empty string or non-zero number, or customCity is a non-empty string
  const hasLocation =
    (typeof form.city === 'string' && form.city.trim() !== '') ||
    (typeof form.city === 'number' && form.city !== 0) ||
    (typeof form.customCity === 'string' && form.customCity.trim() !== '')
  const completionItems = [
    form.firstName,
    form.lastName,
    form.bio,
    form.contactNumber,
    hasLocation,
    user?.profileImageUrl,
    user?.idPhotoUrl,
    user?.driversLicenseUrl,
    user?.proofOfAddressUrl,
  ]
  const completedCount = completionItems.filter(Boolean).length
  const completionPercent = Math.round(
    (completedCount / completionItems.length) * 100
  )

  // Upload handlers
  const uploadFile = async (
    type: 'profile' | 'id' | 'license' | 'address',
    file: File
  ) => {
    setUploading((u) => ({ ...u, [type]: true }))
    const endpointMap = {
      profile: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/users/upload-profile-image`,
      id: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/users/upload-id-photo`,
      license: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/users/upload-drivers-license`,
      address: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/users/upload-proof-of-address`,
    }
    const formData = new FormData()
    formData.append('file', file)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(endpointMap[type], {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      toast.success('Upload successful!')
      await refetch()
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading((u) => ({ ...u, [type]: false }))
    }
  }

  const handleFileChange = (
    type: 'profile' | 'id' | 'license' | 'address',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadFile(type, file)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await completeProfile({
        variables: {
          id: user.id,
          firstName: form.firstName,
          lastName: form.lastName,
          bio: form.bio,
          cityId: form.city ? Number(form.city) : undefined,
          customCity: form.customCity || undefined,
          contactNumber: form.contactNumber || undefined,
        },
      })
      toast.success('Profile updated successfully')
      await refetch()
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div className='flex items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground my-6'>
        <h2 className='mb-4 text-2xl font-bold text-foreground'>
          Complete Your Profile
        </h2>
        {/* Progress Bar */}
        <div className='mb-6'>
          <div className='flex justify-between mb-1'>
            <span className='text-sm font-medium text-foreground'>
              Profile Completion
            </span>
            <span className='text-sm font-medium text-foreground'>
              {completionPercent}%
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-md h-2 dark:bg-gray-700'>
            <div
              className='bg-primary h-2 rounded-md transition-all duration-500'
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              name='firstName'
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              name='lastName'
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          {/* City Autocomplete and Custom City fallback */}
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
                  variant='ghost'
                  className='mt-1 text-xs text-blue-600 underline'
                  onClick={() => setShowCustomCity(false)}
                >
                  Back to city search
                </Button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              name='bio'
              value={form.bio}
              onChange={handleChange}
              placeholder='Tell us a bit about yourself'
            />
          </div>
          <div>
            <Label htmlFor='contactNumber'>Contact Number</Label>
            <Input
              id='contactNumber'
              name='contactNumber'
              value={form.contactNumber}
              onChange={handleChange}
              placeholder='Enter your contact number'
              required
            />
          </div>
          {/* Upload fields */}
          <div>
            <Label>ID Document</Label>
            <div className='flex items-center gap-2'>
              <label className='cursor-pointer flex items-center gap-2 p-2 border rounded-md hover:bg-secondary transition'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => handleFileChange('id', e)}
                  disabled={uploading.id}
                />
                {uploading.id ? (
                  <Loader2
                    className='animate-spin text-primary'
                    size={20}
                  />
                ) : user?.idPhotoUrl ? (
                  <Check
                    className='text-green-600'
                    size={20}
                  />
                ) : (
                  <Upload
                    className='text-muted-foreground'
                    size={20}
                  />
                )}
                <span className='text-sm'>Upload</span>
              </label>
            </div>
          </div>
          <div>
            <Label>Driver&apos;s License</Label>
            <div className='flex items-center gap-2'>
              <label className='cursor-pointer flex items-center gap-2 p-2 border rounded-md hover:bg-secondary transition'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => handleFileChange('license', e)}
                  disabled={uploading.license}
                />
                {uploading.license ? (
                  <Loader2
                    className='animate-spin text-primary'
                    size={20}
                  />
                ) : user?.driversLicenseUrl ? (
                  <Check
                    className='text-green-600'
                    size={20}
                  />
                ) : (
                  <Upload
                    className='text-muted-foreground'
                    size={20}
                  />
                )}
                <span className='text-sm'>Upload</span>
              </label>
            </div>
          </div>
          <div>
            <Label>Proof of Address</Label>
            <div className='flex items-center gap-2'>
              <label className='cursor-pointer flex items-center gap-2 p-2 border rounded-md hover:bg-secondary transition'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => handleFileChange('address', e)}
                  disabled={uploading.address}
                />
                {uploading.address ? (
                  <Loader2
                    className='animate-spin text-primary'
                    size={20}
                  />
                ) : user?.proofOfAddressUrl ? (
                  <Check
                    className='text-green-600'
                    size={20}
                  />
                ) : (
                  <Upload
                    className='text-muted-foreground'
                    size={20}
                  />
                )}
                <span className='text-sm'>Upload</span>
              </label>
            </div>
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Save & Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
