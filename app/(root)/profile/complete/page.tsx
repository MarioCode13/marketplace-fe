'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import CityAutocomplete from '@/components/drawers/CityAutocomplete'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { profileSchema, type ProfileFormData } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { CheckCircle, Pencil, User, Loader2, Info } from 'lucide-react'
import Image from 'next/image'
import OmnicheckTermsModal from '@/components/modals/OmnicheckTermsModal'
import { generateImageUrl } from '@/lib/utils'
import Link from 'next/link'

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

  const [showCustomCity, setShowCustomCity] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [formState, setFormState] = useState({
    city: '',
    cityLabel: '',
    customCity: '',
  })
  const [hasInitializedForm, setHasInitializedForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      contactNumber: user?.contactNumber || '',
      idNumber: user?.idNumber || '',
    },
  })

  useEffect(() => {
    if (!user || hasInitializedForm) {
      return
    }

    setValue('username', user.username || '')
    setValue('email', user.email || '')
    setValue('firstName', user.firstName || '')
    setValue('lastName', user.lastName || '')
    setValue('bio', user.bio || '')
    setValue('contactNumber', user.contactNumber || '')
    setValue('idNumber', user.idNumber || '')
    const cityId = user.city?.id || ''
    const cityLabel = user.city
      ? `${user.city.name}, ${user.city.region.name}, ${user.city.region.country.name}`
      : ''
    setFormState({
      city: cityId,
      cityLabel: cityLabel,
      customCity: user.customCity || '',
    })
    setShowCustomCity(!!user.customCity)
    setHasInitializedForm(true)
  }, [user, setValue, hasInitializedForm])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading profile</p>

  const isProfileComplete = Boolean(
    user?.profileCompletion?.completionPercentage === 100,
  )
  const hasLocation =
    (typeof formState.city === 'string' && formState.city.trim() !== '') ||
    (typeof formState.city === 'number' && formState.city !== 0) ||
    (typeof formState.customCity === 'string' &&
      formState.customCity.trim() !== '')

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const bio = watch('bio')
  const contactNumber = watch('contactNumber')
  const idNumber = watch('idNumber')
  const hasSubscription =
    user?.subscription?.status === 'ACTIVE' ||
    user?.subscription?.status === 'TRIAL'

  const completionItems = [
    firstName,
    lastName,
    bio,
    contactNumber,
    hasLocation,
    idNumber,
    user?.profileImageUrl,
    user?.trustRating?.verifiedId,
  ]
  const completedCount = completionItems.filter(Boolean).length
  const completionPercent = Math.round(
    (completedCount / completionItems.length) * 100,
  )

  const handleVerifyID = async () => {
    if (!idNumber || !firstName || !lastName || !user?.id) {
      toast.error(
        'Please fill in your ID number, first name, and last name before verifying',
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
            idNumber: idNumber,
            firstName: firstName,
            lastName: lastName,
            userId: user.id,
          }),
        },
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.success && data.verifiedID) {
        toast.success('ID verified successfully!')
        await refetch({ fetchPolicy: 'network-only' })
      } else {
        toast.error(
          data.error ||
            'Verification failed. Please check your details and try again.',
        )
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'ID verification failed. Please try again.',
      )
    }
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    const xsrfToken = getCookie('XSRF-TOKEN')

    setImageUploadLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/users/upload-profile-image`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
          },
        },
      )

      if (!response.ok) throw new Error('Upload failed')

      toast.success('Profile image updated!')

      await refetch({ fetchPolicy: 'network-only' })
    } catch (err) {
      toast.error('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setImageUploadLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const submitData = {
        id: user.id,
        username: data.username || undefined,
        email: data.email || undefined,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        bio: data.bio || undefined,
        cityId: formState.city || undefined,
        customCity: formState.customCity || undefined,
        contactNumber: data.contactNumber || undefined,
        idNumber: data.idNumber || undefined,
      }
      await completeProfile({
        variables: submitData,
      })
      toast.success('Profile updated successfully')
      await refetch({ fetchPolicy: 'network-only' })
      router.push('/profile')
    } catch (err) {
      console.error('[CompleteProfile] Submit error:', err)
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center bg-background min-h-screen p-4'>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className='flex w-full max-w-md items-center justify-start my-2'>
          <Link href='/profile'>
            <Button
              variant='outlined'
              color='primary'
            >
              ← Back
            </Button>
          </Link>
        </div>
        <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground my-6'>
          <h2 className='mb-4 text-2xl font-bold text-foreground'>
            {isProfileComplete ? 'Edit Profile' : 'Complete Your Profile'}
          </h2>
          {/* Profile Image Section */}
          <div className='flex justify-center mb-6'>
            <label className='relative w-[120px] h-[120px] cursor-pointer'>
              {user && user.profileImageUrl ? (
                <Image
                  src={generateImageUrl(user.profileImageUrl)}
                  alt='profile'
                  className='rounded-full w-[120px] h-[120px] object-cover'
                  width={120}
                  height={120}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/logo.png'
                  }}
                />
              ) : (
                <div className='flex justify-center h-full items-center bg-gray-200 rounded-full'>
                  <User className='w-[60px] h-[60px] text-gray-400' />
                </div>
              )}
              {imageUploadLoading && (
                <div className='absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full'>
                  <Loader2 className='w-8 h-8 text-white animate-spin' />
                </div>
              )}
              {!imageUploadLoading && (
                <div
                  className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full transition-opacity ${
                    hovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Pencil className='text-white w-5 h-5' />
                </div>
              )}
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
                disabled={imageUploadLoading}
              />
            </label>
          </div>
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
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                placeholder='Enter your username'
                {...register('username')}
                disabled={isProfileComplete}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                placeholder='Enter your email'
                type='email'
                {...register('email')}
                disabled={isProfileComplete}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                placeholder='Enter your first name'
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                placeholder='Enter your last name'
                {...register('lastName')}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
            {/* City Autocomplete and Custom City fallback */}
            <div>
              <CityAutocomplete
                value={formState.city}
                displayValue={formState.cityLabel}
                onChange={(cityId, cityLabel) => {
                  setFormState((prev) => ({
                    ...prev,
                    city: cityId || '',
                    cityLabel: cityLabel || '',
                    customCity: '',
                  }))
                  setShowCustomCity(false)
                }}
                onCantFindCity={() => {
                  setFormState((prev) => ({ ...prev, city: '', cityLabel: '' }))
                  setShowCustomCity(true)
                }}
                label={undefined}
              />
              {showCustomCity && (
                <div className='mt-2'>
                  <Label htmlFor='customCity'>Custom City</Label>
                  <Input
                    id='customCity'
                    value={formState.customCity}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        customCity: e.target.value,
                      }))
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
                placeholder='Tell us a bit about yourself'
                {...register('bio')}
                className={errors.bio ? 'border-red-500' : ''}
              />
              {errors.bio && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.bio.message}
                </p>
              )}
              <p className='text-xs text-muted-foreground mt-1'>
                {bio?.length || 0}/500 characters
              </p>
            </div>
            <div>
              <Label htmlFor='contactNumber'>Contact Number</Label>
              <Input
                id='contactNumber'
                placeholder='Enter your contact number'
                {...register('contactNumber')}
                className={errors.contactNumber ? 'border-red-500' : ''}
              />
              {errors.contactNumber && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='idNumber'>South African ID Number</Label>
              <Input
                id='idNumber'
                placeholder='Enter your 13-digit ID number'
                maxLength={13}
                disabled={user?.trustRating?.verifiedId}
                {...register('idNumber')}
                className={errors.idNumber ? 'border-red-500' : ''}
              />
              {errors.idNumber && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.idNumber.message}
                </p>
              )}
              {isProfileComplete && (
                <p className='text-xs text-muted-foreground mt-1'>
                  Profile is complete; username, email, and ID number cannot be
                  changed.
                </p>
              )}
            </div>
            {/* ID Verification Section */}
            <div className='!mb-8'>
              <div className='flex items-center gap-1 mb-2'>
                <Label>ID Verification</Label>
                {!hasSubscription && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type='button'
                        className='inline-flex items-center rounded-full p-1 text-muted-foreground hover:text-foreground'
                        aria-label='Subscription required for verification'
                      >
                        <Info className='w-4 h-4' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                      <div className='text-xs'>
                        ID verification is only available for subscribed
                        accounts.
                        <Button
                          variant={'text'}
                          color={'input'}
                          size={'sm'}
                          asChild
                          className='ml-1'
                        >
                          <Link href='/subscriptions'>Upgrade</Link>
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
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
                    <div className='flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='outlined'
                        color='primary'
                        onClick={handleVerifyID}
                        disabled={
                          !hasSubscription ||
                          !idNumber ||
                          !firstName ||
                          !lastName
                        }
                      >
                        Verify with OmniCheck
                      </Button>
                    </div>
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
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting
                ? 'Saving...'
                : isProfileComplete
                  ? 'Save Changes'
                  : 'Save & Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
