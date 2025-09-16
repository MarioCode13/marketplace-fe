'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/store/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [form, setForm] = useState({ emailOrUsername: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful!')
      router.push('/')
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
