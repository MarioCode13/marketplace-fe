'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Link from 'next/link'
import { registrationSchema, type RegistrationFormData } from '@/lib/validation'
import {
  normalizeReferralCode,
  REFERRAL_QUERY_PARAM,
  REFERRAL_STORAGE_KEY,
} from '@/lib/constants/referral'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.dealio.org.za'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  useEffect(() => {
    const fromUrl = normalizeReferralCode(
      searchParams.get(REFERRAL_QUERY_PARAM),
    )
    if (fromUrl) {
      setReferralCode(fromUrl)
      sessionStorage.setItem(REFERRAL_STORAGE_KEY, fromUrl)
      return
    }
    const stored = normalizeReferralCode(
      sessionStorage.getItem(REFERRAL_STORAGE_KEY),
    )
    if (stored) {
      setReferralCode(stored)
    }
  }, [searchParams])

  const loading = registerLoading || isSubmitting
  const password = watch('password')
  const normalizedReferral = normalizeReferralCode(referralCode)

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, color: 'bg-gray-200', text: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++

    const strengthMap = {
      0: { color: 'bg-gray-200', text: '' },
      1: { color: 'bg-red-500', text: 'Weak' },
      2: { color: 'bg-orange-500', text: 'Fair' },
      3: { color: 'bg-yellow-500', text: 'Good' },
      4: { color: 'bg-lime-500', text: 'Strong' },
      5: { color: 'bg-green-500', text: 'Very Strong' },
      6: { color: 'bg-green-600', text: 'Very Strong' },
    }
    return {
      strength: strength / 6,
      color: strengthMap[strength as keyof typeof strengthMap].color,
      text: strengthMap[strength as keyof typeof strengthMap].text,
    }
  }

  const passwordStrength = getPasswordStrength()

  const handleUsernameBlur = async (username: string) => {
    if (!username || username.length < 3) return

    setUsernameCheckLoading(true)
    try {
      const params = new URLSearchParams({ username })
      const res = await fetch(
        `${API_BASE}/api/auth/check-username?${params.toString()}`,
        { credentials: 'include' },
      )
      if (!res.ok) {
        toast.error('Failed to check username availability')
        return
      }
      const data = (await res.json()) as { available?: boolean }
      if (!data.available) {
        toast.error('Username is not available')
      } else {
        toast.success('Username is available')
      }
    } catch {
      toast.error('Failed to check username availability')
    } finally {
      setUsernameCheckLoading(false)
    }
  }

  const onSubmit = async (data: RegistrationFormData) => {
    if (!acceptedTerms) {
      toast.error(
        'Please accept the Terms of Use and Privacy Policy to continue',
      )
      return
    }

    const codeToSend = normalizeReferralCode(referralCode)

    setRegisterLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          ...(codeToSend ? { referralCode: codeToSend } : {}),
        }),
      })

      const body = (await res.json()) as {
        success?: boolean
        message?: string
        error?: string
      }

      if (!res.ok) {
        const msg =
          body.message ||
          (typeof body.error === 'string' ? body.error : null) ||
          'Registration failed'
        toast.error(msg)
        return
      }

      if (body.success) {
        sessionStorage.removeItem(REFERRAL_STORAGE_KEY)
        toast.success(
          'Registration successful! Check your email for verification instructions.',
        )
        router.push('/login')
      } else {
        toast.error(body.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      toast.error(
        'An unexpected error occurred: ' +
          (err instanceof Error ? err.message : String(err)),
      )
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-6 text-2xl font-bold text-foreground'>Register</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col'>
            <Label
              htmlFor='username'
              className='mb-2'
            >
              Username
            </Label>
            <Input
              id='username'
              placeholder='Enter your username'
              {...registerField('username')}
              onBlur={(e) => handleUsernameBlur(e.target.value)}
              disabled={usernameCheckLoading}
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.username.message}
              </p>
            )}
          </div>

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
              placeholder='Enter your email'
              {...registerField('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Label
              htmlFor='referralCode'
              className='mb-2'
            >
              Referral code{' '}
              <span className='font-normal text-muted-foreground'>
                (optional)
              </span>
            </Label>
            <Input
              id='referralCode'
              name='referralCode'
              placeholder='Enter a referral code'
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              autoComplete='off'
              className='font-mono uppercase'
            />
            {normalizedReferral && (
              <p className='mt-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-950 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100'>
                You were referred by code{' '}
                <span className='font-mono font-semibold'>
                  {normalizedReferral}
                </span>
                . Referrer will receive boost credits when you sign up.
              </p>
            )}
          </div>

          <div className='flex flex-col mb-4'>
            <Label
              htmlFor='password'
              className='mb-2'
            >
              Password
            </Label>
            <PasswordInput
              id='password'
              placeholder='Enter your password'
              {...registerField('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.password.message}
              </p>
            )}

            {password && (
              <div className='mt-3 space-y-2'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-muted-foreground'>
                    Password strength:
                  </span>
                  <span
                    className={`font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-lg h-2'>
                  <div
                    className={`h-2 rounded-lg transition-all ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength * 100}%` }}
                  ></div>
                </div>
                <ul className='text-xs text-muted-foreground space-y-1 mt-2'>
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </li>
                  <li
                    className={/[A-Z]/.test(password) ? 'text-green-600' : ''}
                  >
                    ✓ One uppercase letter
                  </li>
                  <li
                    className={/[a-z]/.test(password) ? 'text-green-600' : ''}
                  >
                    ✓ One lowercase letter
                  </li>
                  <li
                    className={/[0-9]/.test(password) ? 'text-green-600' : ''}
                  >
                    ✓ One number
                  </li>
                  <li
                    className={
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    ✓ One special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className='flex items-start space-x-2 mb-4'>
            <Checkbox
              id='terms'
              checked={acceptedTerms}
              onCheckedChange={(checked) =>
                setAcceptedTerms(checked as boolean)
              }
              className='mt-1'
            />
            <div className='grid gap-1.5 leading-none'>
              <Label
                htmlFor='terms'
                className='text-sm text-muted-foreground'
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='text-blue-500 hover:underline'
                >
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='text-blue-500 hover:underline'
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>

          <div className='space-y-3'>
            <Button
              type='submit'
              variant='contained'
              className='w-full'
              disabled={loading || !acceptedTerms}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>

            <Button
              type='button'
              variant={'outlined'}
              color='primary'
              className='w-full'
              onClick={() => router.push('/login')}
            >
              Or Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function RegisterFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-6 text-2xl font-bold text-foreground'>Register</h2>
        <p className='text-muted-foreground'>Loading…</p>
      </div>
    </div>
  )
}

export default function Register() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  )
}
