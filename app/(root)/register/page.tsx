'use client'

import { ApolloError, gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Link from 'next/link'

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      email
      role
    }
  }
`

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      toast.error(
        'Please accept the Terms of Use and Privacy Policy to continue'
      )
      return
    }

    try {
      await register({ variables: form })
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
                  'An account with this email or username already exists'
              )
              break
            case 'VALIDATION_ERROR':
              toast.error(
                graphQLError.message || 'Please check your input and try again'
              )
              break
            case 'AUTH_ERROR':
              toast.error(
                graphQLError.message || 'Registration failed. Please try again'
              )
              break
            default:
              toast.error(
                graphQLError.message || 'Registration failed. Please try again'
              )
          }
        } else {
          toast.error('Registration failed. Please try again')
        }
      } else {
        // Optional: handle unknown errors
        console.error('Unexpected error:', err)
        toast.error('An unexpected error occurred.')
      }
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-6 text-2xl font-bold text-foreground'>Register</h2>
        <form
          onSubmit={handleSubmit}
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
              name='username'
              placeholder='Enter your username'
              onChange={handleChange}
              required
            />
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
              name='email'
              placeholder='Enter your email'
              onChange={handleChange}
              required
            />
          </div>

          <div className='flex flex-col mb-4'>
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

          {error && (
            <p className='text-sm text-red-500 text-center'>{error.message}</p>
          )}

          <div className='space-y-3'>
            <Button
              type='submit'
              variant='default'
              className='w-full'
              disabled={loading || !acceptedTerms}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>

            <Button
              type='button'
              btnColor='secondary'
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
