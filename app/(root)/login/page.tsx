'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginUser, fetchUserProfile } from '@/store/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useLazyQuery } from '@apollo/client'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { setUserContext } from '@/store/userContextSlice'

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [form, setForm] = useState({ emailOrUsername: '', password: '' })
  const [getMyBusiness] = useLazyQuery(GET_MY_BUSINESS)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (result.meta.requestStatus === 'fulfilled') {
      // Fetch full user profile and sync userContext
      const profileResult = await dispatch(fetchUserProfile())
      if (fetchUserProfile.fulfilled.match(profileResult)) {
        const user = profileResult.payload
        // Fetch business context after login
        const { data: businessData } = await getMyBusiness()
        const business = businessData?.myBusiness
        const userContext = {
          userId: user.id,
          username: user.username,
          businessId: business?.id || null,
          businessName: business?.name || null,
          role:
            business?.businessUsers?.find(
              (bu: { user: { id: string }; role: string }) =>
                bu.user.id === user.id
            )?.role ||
            user.role ||
            null,
          isBusinessUser: !!business,
          isBusinessOwner:
            business?.businessUsers?.find(
              (bu: { user: { id: string }; role: string }) =>
                bu.user.id === user.id &&
                (bu.role === 'OWNER' || bu.role === 'ADMIN')
            ) !== undefined,
          canEditListing:
            business?.businessUsers?.find(
              (bu: { user: { id: string }; role: string }) =>
                bu.user.id === user.id &&
                (bu.role === 'OWNER' ||
                  bu.role === 'ADMIN' ||
                  bu.role === 'MEMBER')
            ) !== undefined,
          canViewBusinessTransactions:
            business?.businessUsers?.find(
              (bu: { user: { id: string }; role: string }) =>
                bu.user.id === user.id &&
                (bu.role === 'OWNER' || bu.role === 'ADMIN')
            ) !== undefined,
          profileImageUrl: user.profileImageUrl || null,
        }
        dispatch(setUserContext(userContext))
        console.log('User context:', userContext)
        toast.success('Login successful!')
        router.push('/')
      } else {
        toast.dismiss()
        toast.error('Failed to fetch user profile.')
      }
    } else {
      toast.dismiss()
      toast.error(error || 'Login failed. Please try again.')
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-6 text-2xl font-bold text-foreground'>Login</h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col'>
            <Label
              htmlFor='emailOrUsername'
              className='mb-2'
            >
              Email or Username
            </Label>
            <Input
              id='emailOrUsername'
              name='emailOrUsername'
              placeholder='Enter your email or username'
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col mb-5'>
            <Label
              htmlFor='password'
              className='mb-2'
            >
              Password
            </Label>
            <Input
              id='password'
              type='password'
              name='password'
              placeholder='Enter your password'
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <div className='space-y-3'>
            <Button
              type='submit'
              variant={'contained'}
              color='gradient'
              className='w-full'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Button
              type='button'
              variant={'outlined'}
              color='gradient'
              className='w-full'
              onClick={() => router.push('/register')}
            >
              Or Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
