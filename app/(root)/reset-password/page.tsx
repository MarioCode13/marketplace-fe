'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error('Reset token is missing or invalid')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to reset password')
      }

      toast.success('Password reset successfully. Please log in.')
      router.push('/login')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Reset failed'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-2 text-2xl font-bold text-foreground'>
          Reset Password
        </h2>
        <p className='mb-6 text-sm text-muted-foreground'>
          Enter and confirm your new password.
        </p>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col'>
            <Label
              htmlFor='newPassword'
              className='mb-2'
            >
              New Password
            </Label>
            <PasswordInput
              id='newPassword'
              name='newPassword'
              placeholder='Enter new password'
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col'>
            <Label
              htmlFor='confirmPassword'
              className='mb-2'
            >
              Confirm Password
            </Label>
            <PasswordInput
              id='confirmPassword'
              name='confirmPassword'
              placeholder='Confirm new password'
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
