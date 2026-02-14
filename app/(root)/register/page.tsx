'use client'

import { ApolloError, gql, useMutation, useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
import { CHECK_USERNAME_AVAILABLE } from '@/lib/graphql/mutations/authMutations'

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      email
      role
      userId
    }
  }
`

export default function Register() {
  const router = useRouter()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false)
  const [register, { loading: registerLoading }] =
    useMutation(REGISTER_MUTATION)
  const [checkUsernameAvailable] = useLazyQuery(CHECK_USERNAME_AVAILABLE)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const loading = registerLoading || isSubmitting
  const password = watch('password')

  // Password strength indicator
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
      const { data } = await checkUsernameAvailable({
        variables: { username },
      })
      const isAvailable = data.checkUsernameAvailable

      if (!isAvailable) {
        toast.error('Username is not available')
      } else {
        toast.success('Username is available')
      }
    } catch (err) {
      const errorMsg =
        err instanceof ApolloError && err.graphQLErrors.length > 0
          ? err.graphQLErrors[0].message
          : 'Failed to check username availability'
      toast.error(errorMsg)
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

    try {
      await register({ variables: data })
      toast.success('Registration successful! You can now login')
      router.push('/login')
    } catch (err) {
      if (err instanceof ApolloError) {
        if (err.graphQLErrors.length > 0) {
          const graphQLError = err.graphQLErrors[0]
          const errorCode = graphQLError.extensions?.code

          switch (errorCode) {
            case 'USER_ALREADY_EXISTS':
              toast.error(
                graphQLError.message ||
                  'An account with this email or username already exists',
              )
              break
            case 'VALIDATION_ERROR':
              toast.error(
                graphQLError.message || 'Please check your input and try again',
              )
              break
            case 'AUTH_ERROR':
              toast.error(
                graphQLError.message || 'Registration failed. Please try again',
              )
              break
            default:
              toast.error(
                graphQLError.message || 'Registration failed. Please try again',
              )
          }
        } else {
          toast.error('Registration failed. Please try again')
        }
      } else {
        toast.error('An unexpected error occurred: ' + (err as Error).message)
      }
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
          {/* Username Field */}
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

          {/* Email Field */}
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

          {/* Password Field */}
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

            {/* Password Strength Indicator */}
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

          {/* Terms Acceptance */}
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
                  className='text-blue-600 hover:underline'
                >
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='text-blue-600 hover:underline'
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
