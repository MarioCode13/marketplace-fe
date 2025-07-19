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
import { GET_TRUST_RATING } from '@/lib/graphql/queries/getTrustRating'
import { GET_ME } from '@/lib/graphql/queries/getMe'
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
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_ME)
  const [updateProfile] = useMutation(UPDATE_PROFILE)
  const [form, setForm] = useState({ username: '', email: '' })
  const [editing, setEditing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { refetch } = useQuery(GET_ME)
  const [profileComplete] = useState(false)

  // Fetch trust rating data
  const { data: trustData, loading: trustLoading } = useQuery(
    GET_TRUST_RATING,
    {
      variables: { userId: data?.me?.id },
      skip: !data?.me?.id,
    }
  )
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const user = data?.me
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
      <div className='w-full max-w-4xl py-8 px-6'>
        <div className='w-full max-w-md mx-auto rounded-lg p-6 shadow-lg bg-componentBackground'>
          <div className='w-full flex justify-between items-center'>
            <h2 className='mb-4 text-2xl font-bold text-foreground'>Profile</h2>
            {profileComplete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CheckCircle className='text-green-500 w-5 h-5 ml-2 cursor-pointer hover:scale-110' />
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
              {user.profileImageUrl ? (
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

              {/* Hidden file input */}
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => handleFileChange(e)}
              />

              {/* Hover Overlay */}
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
              className='space-y-4'
            >
              <div>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type='submit'
                className='w-full'
              >
                Save Changes
              </Button>
            </form>
          ) : (
            <div>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <Button
                className='w-full mt-3'
                onClick={handleEdit}
              >
                Edit
              </Button>
            </div>
          )}
          {!profileComplete && (
            <Button
              variant={'secondary'}
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

          {/* Trust Rating Section */}
          {trustLoading ? (
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
                No trust rating available yet.
              </p>
              <Button
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => router.push('/profile/complete')}
              >
                Complete Profile to Build Trust
              </Button>
            </div>
          )}

          <Button
            variant='destructive'
            className='w-full mt-6'
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
