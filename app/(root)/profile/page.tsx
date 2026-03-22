'use client'

import { ChangeEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { logoutUser, refetchUserProfile } from '@/store/userContextSlice'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  useBusinessTrustRatingQuery,
  useGetTrustRatingQuery,
  useMeQuery,
} from '@/lib/graphql/generated'
import {
  Pencil,
  User,
  CheckCircle,
  Shield,
  Star,
  ShieldCheck,
  Settings,
  Building,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TrustRatingDisplay } from '@/components/TrustRatingDisplay'
import { generateImageUrl } from '@/lib/utils'
import { checkImageContent } from '@/lib/utils/contentModeration'

export default function Profile() {
  const router = useRouter()

  const [hovered, setHovered] = useState(false)
  const [profileImageLoading, setProfileImageLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.userContext)
  const userContext = useSelector((state: RootState) => state.userContext)
  const business = userContext.business
  const userId = userContext.userId // Redirect to login if not authenticated
  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
  }, [userId, router])

  const businessId = userContext.businessId || business?.id

  const { data: businessTrustData, loading: businessTrustLoading } =
    useBusinessTrustRatingQuery({
      variables: { businessId: businessId ?? '' },
      skip: !businessId,
    })
  // Only fetch user trust rating if not a business user
  const { data: trustData, loading: trustLoading } = useGetTrustRatingQuery({
    variables: { userId: userId ?? '' },
    skip: !userId || !!businessId,
  })

  // Get server-side user object for verification status
  const { data: meData } = useMeQuery()
  // Use userContext fields for business user logic
  const isBusinessUser = userContext.isBusinessUser
  const canEditBusinessProfile = userContext.isBusinessOwner
  const canUpgrade = user?.planType !== 'PRO_STORE'
  const reseller = user?.planType === 'RESELLER'

  const profileComplete =
    meData?.me?.profileCompletion?.completionPercentage === 100 || false

  const handleLogout = () => {
    dispatch(logoutUser())
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

    setProfileImageLoading(true)
    try {
      // Check for explicit content
      const contentCheck = await checkImageContent(file)
      if (contentCheck.isExplicit) {
        toast.error(
          contentCheck.reason ||
            'Image contains explicit content and cannot be uploaded',
        )
        setProfileImageLoading(false)
        return
      }

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

      // const imageUrl = await response.text()

      toast.success('Profile image updated!')

      await dispatch(refetchUserProfile())
      // if (userId) {
      //   dispatch(updateUserProfileImage({ userId, url: imageUrl }))
      // }
    } catch (err) {
      toast.error('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setProfileImageLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (!userId) {
    return (
      <div className='w-full flex justify-center items-center min-h-screen'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-4xl py-16 px-6'>
          <div className='w-full max-w-md mx-auto rounded-lg p-6 shadow-lg bg-componentBackground'>
            <div className='w-full flex justify-between items-center mb-2'>
              <h2 className=' text-2xl font-bold text-foreground'>Profile</h2>
              <div className='flex gap-2'>
                {profileComplete && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle className='text-success w-5 h-5  cursor-pointer hover:scale-110' />
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        <p>Profile complete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {meData?.me?.trustRating?.verifiedId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldCheck className='text-success w-5 h-5 cursor-pointer hover:scale-110' />
                      </TooltipTrigger>
                      <TooltipContent side='top'>
                        <p>ID Verified</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>{' '}
            <div className='relative flex justify-center items-center w-full mb-3'>
              <label className='relative w-[140px] h-[140px] cursor-pointer'>
                {profileImageLoading && (
                  <div className='absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full z-20'>
                    <Spinner />
                  </div>
                )}
                {user && user.profileImageUrl ? (
                  <Image
                    src={generateImageUrl(user.profileImageUrl)}
                    alt='profile'
                    className='rounded-full w-[140px] h-[140px] object-cover'
                    width={140}
                    height={140}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo.png'
                    }}
                  />
                ) : (
                  <div className='flex justify-center h-full items-center'>
                    <User className='rounded-full w-[90px] h-[90px] object-cover' />
                  </div>
                )}
                <input
                  type='file'
                  accept='image/*'
                  disabled={profileImageLoading}
                  className='hidden'
                  onChange={handleFileChange}
                />
                <div
                  className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full transition-opacity ${
                    hovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Pencil className='text-white' />
                </div>
              </label>
            </div>
            <div className='mt-6'>
              {user ? (
                <>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </>
              ) : (
                <p className='text-sm text-gray-500'>Loading user data...</p>
              )}

              <Button
                variant={'contained'}
                color={'primary'}
                className='w-full mt-3'
                onClick={() => router.push('/profile/complete')}
              >
                {profileComplete ? 'Edit Profile' : 'Complete Your Profile'}{' '}
                <Pencil size={18} />
              </Button>

              <Button
                variant={'outlined'}
                color={'primary'}
                className='w-full mt-3'
                onClick={() => router.push('/profile/preferences')}
              >
                Account Preferences <Settings size={18} />
              </Button>
            </div>
            {/* Trust Rating Section */}
            {businessId ? (
              businessTrustLoading ? (
                <div className='mt-6 p-4 border border-secondary rounded-lg'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Shield className='w-5 h-5 text-blue-600' />
                    <h3 className='font-semibold'>Trust Rating</h3>
                  </div>
                  <p className='text-sm text-gray-600'>
                    Loading business trust rating...
                  </p>
                </div>
              ) : businessTrustData?.businessTrustRating ? (
                <div className='mt-6 p-4 border border-secondary rounded-lg'>
                  <div className='flex items-center gap-2 mb-3 justify-between w-full'>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-5 h-5 text-blue-600' />
                      <h3 className='font-semibold'>Business Trust Rating</h3>
                    </div>
                    <div>
                      {businessTrustData.businessTrustRating
                        .verifiedWithThirdParty && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ShieldCheck className='text-success w-5 h-5 ml-2 cursor-pointer hover:scale-110' />
                            </TooltipTrigger>
                            <TooltipContent side='top'>
                              <p>Business Verified</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div>
                      <span className='font-semibold'>Average Rating:</span>
                      <span className='ml-2'>
                        {businessTrustData.businessTrustRating.averageRating.toFixed(
                          2,
                        )}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold'>Review Count:</span>
                      <span className='ml-2'>
                        {businessTrustData.businessTrustRating.reviewCount}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='mt-6 p-4 border border-secondary rounded-lg'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Shield className='w-5 h-5 text-blue-600' />
                    <h3 className='font-semibold'>Trust Rating</h3>
                  </div>
                  <p className='text-sm text-gray-600'>
                    No business trust rating available.
                  </p>
                </div>
              )
            ) : trustLoading ? (
              <div className='mt-6 p-4 border border-secondary rounded-lg'>
                <div className='flex items-center gap-2 mb-3'>
                  <Shield className='w-5 h-5 text-blue-600' />
                  <h3 className='font-semibold'>Trust Rating</h3>
                </div>
                <p className='text-sm text-gray-600'>Loading trust rating...</p>
              </div>
            ) : trustData?.getTrustRating ? (
              <div className='mt-6'>
                <TrustRatingDisplay
                  trustRating={trustData.getTrustRating}
                  showDetails={true}
                />
              </div>
            ) : (
              <div className='mt-6 p-4 border border-secondary rounded-lg'>
                <div className='flex items-center gap-2 mb-3'>
                  <Shield className='w-5 h-5 text-blue-600' />
                  <h3 className='font-semibold'>Trust Rating</h3>
                </div>
                <p className='text-sm text-gray-600'>
                  No user trust rating available.
                </p>
              </div>
            )}
            {isBusinessUser && !canEditBusinessProfile && (
              <div className='text-xs text-gray-500 mt-2'>
                Only the business owner or manager can complete the business
                profile.
              </div>
            )}
            {canUpgrade && (
              <Button
                color={'primary'}
                variant={'contained'}
                className='w-full mt-6'
                onClick={() => router.push('/subscriptions')}
              >
                Upgrade {reseller ? 'Store' : 'Profile'} <Star size={18} />
              </Button>
            )}
            {isBusinessUser && (
              <Button
                className='w-full mt-3'
                color={'secondary'}
                variant={'contained'}
                onClick={() => router.push('/business/edit')}
              >
                Configure Business <Building size={18} />
              </Button>
            )}
            {/* Manage Subscriptions CTA */}
            {isBusinessUser && (
              <Button
                className='w-full mt-3'
                color={'gradient'}
                variant={'contained'}
                onClick={() => router.push('/profile/subscriptions')}
              >
                Manage Subscription <CreditCard size={18} />
              </Button>
            )}
            <Button
              variant='outlined'
              color='primary'
              className='w-full mt-6'
              onClick={handleLogout}
            >
              Logout <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
