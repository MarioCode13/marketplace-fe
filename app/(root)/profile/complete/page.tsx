'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Upload, Check, Loader2 } from 'lucide-react'

const GET_PROFILE = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      bio
      location
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
    $location: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      location: $location
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
    location: user?.location || '',
  })
  const [uploading, setUploading] = useState({
    profile: false,
    id: false,
    license: false,
    address: false,
  })

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
      })
    }
  }, [user])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading profile</p>

  // Completion logic
  const completionItems = [
    form.firstName,
    form.lastName,
    form.bio,
    form.location,
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
          ...form,
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
          <div>
            <Label htmlFor='location'>Location</Label>
            <Input
              id='location'
              name='location'
              value={form.location}
              onChange={handleChange}
            />
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
