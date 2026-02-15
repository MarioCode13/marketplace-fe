'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/store/userContextSlice'
import { AppDispatch } from '@/store/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const [form, setForm] = useState({ emailOrUsername: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleResendVerification = async () => {
    if (!form.emailOrUsername) {
      toast.error('Please enter your email or username')
      return
    }

    setResendLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.emailOrUsername }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email')
      }

      toast.success('Verification email sent! Please check your inbox.')
      setShowResendVerification(false)
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Failed to resend verification email'
      toast.error(errorMsg)
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('[Login] Submitting form with:', form)
    try {
      const resultAction = await dispatch(loginUser(form))
      console.log('[Login] Dispatch result:', resultAction)
      console.log(
        '[Login] Is fulfilled?',
        loginUser.fulfilled.match(resultAction),
      )

      if (loginUser.fulfilled.match(resultAction)) {
        console.log('[Login] Login successful')
        toast.success('Login successful!')
        router.push('/')
      } else {
        const errorMsg = (resultAction.payload as string) || 'Login failed'
        console.log('[Login] Login failed with error:', errorMsg)
        console.log('[Login] Error lowercase:', errorMsg.toLowerCase())
        console.log(
          '[Login] Includes verify?',
          errorMsg.toLowerCase().includes('verify'),
        )
        console.log(
          '[Login] Includes verification?',
          errorMsg.toLowerCase().includes('verification'),
        )

        // Check if error is related to email verification
        if (
          errorMsg.toLowerCase().includes('verify') ||
          errorMsg.toLowerCase().includes('verification')
        ) {
          console.log('[Login] Setting showResendVerification to true')
          setShowResendVerification(true)
          toast.error(errorMsg)
        } else {
          console.log(
            '[Login] Not a verification error, just showing error toast',
          )
          toast.error(errorMsg)
        }
      }
    } catch (err) {
      console.log('[Login] Caught error:', err)
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
            <PasswordInput
              id='password'
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

            {showResendVerification && (
              <Button
                type='button'
                variant={'contained'}
                color='primary'
                className='w-full'
                disabled={resendLoading}
                onClick={handleResendVerification}
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            )}

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
