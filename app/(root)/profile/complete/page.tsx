'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import CityAutocomplete from '@/components/drawers/CityAutocomplete'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import OmnicheckTermsModal from '@/components/modals/OmnicheckTermsModal'

const COMPLETE_PROFILE = gql`
  mutation CompleteProfile(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $bio: String
    $cityId: ID
    $customCity: String
    $contactNumber: String
    $idNumber: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      cityId: $cityId
      customCity: $customCity
      contactNumber: $contactNumber
      idNumber: $idNumber
    ) {
      id
    }
  }
`

export default function CompleteProfilePage() {
  const router = useRouter()
  const { loading, error, data, refetch } = useQuery(GET_ME)
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
    idNumber: user?.idNumber || '',
  })

  const [showCustomCity, setShowCustomCity] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

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
        idNumber: user.idNumber || '',
      })
      setShowCustomCity(!!user.customCity)
    }
  }, [user])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading profile</p>

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
    user?.idVerified,
  ]
  const completedCount = completionItems.filter(Boolean).length
  const completionPercent = Math.round(
    (completedCount / completionItems.length) * 100
  )

  const handleVerifyID = async () => {
    if (!form.idNumber || !form.firstName || !form.lastName || !user?.id) {
      toast.error(
        'Please fill in your ID number, first name, and last name before verifying'
      )
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/id-verify`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idNumber: form.idNumber,
            firstName: form.firstName,
            lastName: form.lastName,
            userId: user.id,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.success && data.verifiedID) {
        toast.success('ID verified successfully!')
        await refetch()
      } else {
        toast.error(
          data.error ||
            'Verification failed. Please check your details and try again.'
        )
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'ID verification failed. Please try again.'
      )
    }
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
          cityId: form.city || undefined,
          customCity: form.customCity || undefined,
          contactNumber: form.contactNumber || undefined,
          idNumber: form.idNumber || undefined,
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
                  variant='text'
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
          <div>
            <Label htmlFor='idNumber'>South African ID Number</Label>
            <Input
              id='idNumber'
              name='idNumber'
              value={form.idNumber}
              onChange={handleChange}
              placeholder='Enter your 13-digit ID number'
              maxLength={13}
              required
            />
            <span className='text-xs text-muted-foreground mt-1 block'>
              Required for ID verification with OmniCheck
            </span>
          </div>
          {/* ID Verification Section */}
          <div className='!mb-8'>
            <Label>ID Verification</Label>
            <div className='flex flex-col gap-2'>
              {user?.trustRating?.verifiedId ? (
                <div className='inline-flex items-center gap-2 px-3 py-2 rounded-md bg-success/10 text-success'>
                  <CheckCircle className='w-4 h-4' />
                  <span className='font-medium'>
                    ID Verified with OmniCheck
                  </span>
                </div>
              ) : (
                <>
                  <Button
                    type='button'
                    variant='outlined'
                    color='primary'
                    onClick={handleVerifyID}
                    disabled={
                      !form.idNumber || !form.firstName || !form.lastName
                    }
                  >
                    Verify with OmniCheck
                  </Button>
                  <span className='text-xs text-muted-foreground'>
                    By verifying your ID, you agree to our use of
                    <button
                      type='button'
                      className='text-blue-600 underline ml-1'
                      onClick={() => setShowTermsModal(true)}
                    >
                      OmniCheck terms
                    </button>
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Terms Modal */}
          {showTermsModal && (
            <OmnicheckTermsModal setShowTermsModal={setShowTermsModal} />
          )}
          <Button
            type='submit'
            className='w-full'
            variant={'contained'}
            color={'primary'}
            onClick={() => router.push('/profile')}
          >
            Save & Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
