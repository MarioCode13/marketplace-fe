'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { logout } from '@/store/authSlice'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  useBusinessTrustRatingQuery,
  useGetTrustRatingQuery,
} from '@/lib/graphql/generated'
import {
  Pencil,
  User,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TrustRatingDisplay } from '@/components/TrustRatingDisplay'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { generateImageUrl } from '@/lib/utils'

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $username: String!, $email: String!) {
    updateUser(id: $id, username: $username, email: $email) {
      id
      username
      email
    }
  }
`

export default function Profile() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '' })
  const [editing, setEditing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { data, refetch } = useQuery(GET_ME)
  const user = data?.me
  const userId = user?.id
  const profileComplete = user?.profileComplete
  const { data: businessData } = useQuery(GET_MY_BUSINESS)
  const business = businessData?.myBusiness
  const businessId = business?.id
  const [updateProfile] = useMutation(UPDATE_PROFILE)
  // Always use business trust rating if businessId is present
  const { data: businessTrustData, loading: businessTrustLoading } =
    useBusinessTrustRatingQuery({
      variables: { businessId },
      skip: !businessId,
    })
  // Only fetch user trust rating if not a business user
  const { data: trustData, loading: trustLoading } = useGetTrustRatingQuery({
    variables: { userId },
    skip: !userId || !!businessId,
  })
  let isBusinessUser = false
  let canEditBusinessProfile = false
  if (business && business.businessUsers && userId) {
    interface BusinessUser {
      user: {
        id: string
      }
      role: 'OWNER' | 'MANAGER' | 'EMPLOYEE' | string
    }
    const businessUser: BusinessUser | undefined = business.businessUsers.find(
      (bu: BusinessUser) => bu.user.id === userId
    )
    if (businessUser) {
      isBusinessUser = true
      if (businessUser.role === 'OWNER' || businessUser.role === 'MANAGER') {
        canEditBusinessProfile = true
      }
    }
  }
  const canUpgrade = user?.planType !== 'PRO_STORE'
  const reseller = user?.planType === 'RESELLER'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = () => {
    setForm({ username: user.username, email: user.email })
    setEditing(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({ variables: { id: user.id, ...form } })
    setEditing(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/users/upload-profile-image`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        toast.dismiss()
        toast.success('Profile image updated!')
        await refetch()
      } else {
        toast.dismiss()
        toast.error('Upload failed. Please try again.')
      }
    } catch (err) {
      toast.dismiss()
      toast.error(`Something went wrong. ${err}`)
    }
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-4xl py-8 px-6'>
          <div className='w-full max-w-md mx-auto rounded-lg p-6 shadow-lg bg-componentBackground'>
            <div className='w-full flex justify-between items-center'>
              <h2 className='mb-4 text-2xl font-bold text-foreground'>
                Profile
              </h2>
              {profileComplete && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircle className='text-success w-5 h-5 ml-2 cursor-pointer hover:scale-110' />
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                      <p>Profile complete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className='relative flex justify-center items-center w-full mb-3'>
              <label className='relative w-[140px] h-[140px] cursor-pointer'>
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

            {editing ? (
              <form
                onSubmit={handleSubmit}
                className='mt-6'
              >
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
                  className='mb-3'
                  disabled={!user}
                />
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className='mb-3'
                  disabled={!user}
                />
                <Button
                  variant={'contained'}
                  color={'primary'}
                  className='w-full mt-3'
                  type='submit'
                  disabled={!user}
                >
                  Save Changes
                </Button>
              </form>
            ) : (
              <div>
                {user ? (
                  <>
                    <p>
                      <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <Button
                      variant={'contained'}
                      color={'primary'}
                      className='w-full mt-3'
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                  </>
                ) : (
                  <p className='text-sm text-gray-500'>Loading user data...</p>
                )}
              </div>
            )}

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
                  <div className='flex items-center gap-2 mb-3'>
                    <Shield className='w-5 h-5 text-blue-600' />
                    <h3 className='font-semibold'>Business Trust Rating</h3>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div>
                      <span className='font-semibold'>Average Rating:</span>
                      <span className='ml-2'>
                        {businessTrustData.businessTrustRating.averageRating.toFixed(
                          2
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
                  {isBusinessUser && canEditBusinessProfile && (
                    <Button
                      variant='outlined'
                      size='sm'
                      className='mt-2'
                      onClick={() => router.push('/profile/business-edit')}
                    >
                      Complete Business Profile
                    </Button>
                  )}
                  {isBusinessUser && !canEditBusinessProfile && (
                    <div className='text-xs text-gray-500 mt-2'>
                      Only the business owner or manager can complete the
                      business profile.
                    </div>
                  )}
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
                <div className='text-xs text-blue-600 mt-2'>
                  User trust rating
                </div>
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

            {!profileComplete && (
              <Button
                color={'secondary'}
                variant={'contained'}
                className='w-full mt-6'
                onClick={() => router.push('/profile/complete')}
              >
                Complete Your Profile <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            )}
            {canUpgrade && (
              <Button
                className='w-full mt-6'
                onClick={() => router.push('/subscriptions')}
              >
                Upgrade {reseller ? 'Store' : 'Profile'} <Star size={18} />
              </Button>
            )}

            {/* Configure Business CTA */}
            {isBusinessUser && (
              <Button
                className='w-full mt-3'
                variant={'outlined'}
                onClick={() => router.push('/business/edit')}
              >
                Configure Business
              </Button>
            )}

            {/* Manage Subscriptions CTA */}
            {isBusinessUser && (
              <Button
                className='w-full mt-3'
                variant={'outlined'}
                onClick={() => router.push('/profile/subscriptions')}
              >
                Manage Subscription
              </Button>
            )}

            <Button
              variant='outlined'
              color='primary'
              className='w-full mt-6'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
