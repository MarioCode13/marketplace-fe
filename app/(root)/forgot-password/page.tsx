'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit password reset request')
      }

      toast.success(
        'If an account exists with this email, a reset link has been sent.',
      )
      router.push('/login')
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to submit request'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-2 text-2xl font-bold text-foreground'>
          Forgot Password
        </h2>
        <p className='mb-6 text-sm text-muted-foreground'>
          Enter your email and we&apos;ll send a link to reset your password.
        </p>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col'>
            <Label
              htmlFor='email'
              className='mb-2'
            >
              Email
            </Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
            />
          </div>

          <Button
            type='submit'
            variant={'contained'}
            color='gradient'
            className='w-full'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Button
            type='button'
            variant={'outlined'}
            color='gradient'
            className='w-full'
            onClick={() => router.push('/login')}
          >
            Back to Login
          </Button>
        </form>
      </div>
    </div>
  )
}
