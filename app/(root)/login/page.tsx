'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/store/userContextSlice'
import { AppDispatch } from '@/store/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
// import { useLazyQuery } from '@apollo/client' // Not used
// import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness' // Not used
// import { setUserContext } from '@/store/userContextSlice' // No longer needed

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  // const userContext = useSelector((state: RootState) => state.userContext) // Not used
  // Optionally, add local loading/error state
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({ emailOrUsername: '', password: '' })
  // const [getMyBusiness] = useLazyQuery(GET_MY_BUSINESS) // Not used

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Use centralized login thunk
      const resultAction = await dispatch(loginUser(form))
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Login successful!')
        router.push('/')
      } else {
        throw new Error((resultAction.payload as string) || 'Login failed')
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
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
