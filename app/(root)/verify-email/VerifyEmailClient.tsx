'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Props {
  initialSuccess?: string | null
  initialMessage?: string | null
  initialError?: string | null
}

export default function VerifyEmailClient({
  initialSuccess,
  initialMessage,
  initialError,
}: Props) {
  const router = useRouter()
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (initialSuccess === 'true') {
      setVerified(true)
      if (initialMessage) toast.success(decodeURIComponent(initialMessage))
    } else if (initialSuccess === 'false') {
      setError(
        initialError
          ? decodeURIComponent(initialError)
          : 'Email verification failed',
      )
      if (initialError) toast.error(decodeURIComponent(initialError))
    }
  }, [initialSuccess, initialMessage, initialError])

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setResendLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email')
      }

      toast.success('Verification email sent! Please check your inbox.')
      setEmail('')
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

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        {verified ? (
          <div className='flex flex-col items-center justify-center gap-4 text-center'>
            <div className='text-5xl'>✓</div>
            <h2 className='text-2xl font-bold text-foreground'>
              Email Verified
            </h2>
            <p className='text-muted-foreground'>
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
            <Button
              variant={'contained'}
              color='gradient'
              className='w-full mt-4'
              onClick={() => router.push('/login')}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 text-center'>
            <div className='text-5xl'>✗</div>
            <h2 className='text-2xl font-bold text-foreground'>
              Verification Failed
            </h2>
            <p className='text-muted-foreground mb-6'>{error}</p>

            <div className='w-full space-y-4'>
              <div className='flex flex-col'>
                <Label
                  htmlFor='email'
                  className='mb-2'
                >
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                variant={'contained'}
                color='primary'
                className='w-full'
                disabled={resendLoading}
                onClick={handleResendVerification}
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>

              <Button
                variant={'outlined'}
                color='gradient'
                className='w-full'
                onClick={() => router.push('/login')}
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
