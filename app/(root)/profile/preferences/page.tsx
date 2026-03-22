'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const GET_ME_EXPLICIT = gql`
  query MeForExplicitContent {
    me {
      id
      ageVerified
      allowsExplicitContent
      dateOfBirth
      profileCompletion {
        completionPercentage
      }
    }
  }
`

const VERIFY_USER_AGE = gql`
  mutation VerifyUserAge($dateOfBirth: String!) {
    verifyUserAge(dateOfBirth: $dateOfBirth) {
      id
      ageVerified
    }
  }
`

const UPDATE_EXPLICIT_CONTENT_PREFERENCE = gql`
  mutation UpdateExplicitContentPreference($allowExplicit: Boolean!) {
    updateExplicitContentPreference(allowExplicit: $allowExplicit) {
      id
      allowsExplicitContent
    }
  }
`

export default function ProfilePreferencesPage() {
  const router = useRouter()
  const { data, loading, error, refetch } = useQuery(GET_ME_EXPLICIT, {
    fetchPolicy: 'network-only',
  })

  const [verifyUserAge] = useMutation(VERIFY_USER_AGE)
  const [updateExplicit] = useMutation(UPDATE_EXPLICIT_CONTENT_PREFERENCE)

  const me = data?.me
  const [allowExplicit, setAllowExplicit] = useState(false)
  const [dobValue, setDobValue] = useState(me?.dateOfBirth ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    setAllowExplicit(me?.allowsExplicitContent ?? false)
    if (me?.dateOfBirth) setDobValue(me.dateOfBirth)
  }, [me])

  const handleVerify = async () => {
    if (!dobValue) {
      toast.error('Enter your date of birth to verify your age.')
      return
    }

    setIsVerifying(true)
    try {
      const { data } = await verifyUserAge({
        variables: { dateOfBirth: dobValue },
      })

      if (data?.verifyUserAge?.ageVerified) {
        toast.success('Age verified successfully!')
        await refetch({ fetchPolicy: 'network-only' })
      } else {
        toast.error('Age verification failed. You must be 18+ to proceed.')
      }
    } catch (err) {
      toast.error('Unable to verify age. Please try again later.')
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleToggleExplicit = async () => {
    if (!me?.ageVerified) {
      toast.error('You must verify age before enabling explicit content.')
      return
    }

    setIsSaving(true)
    try {
      const newValue = !allowExplicit
      await updateExplicit({
        variables: { allowExplicit: newValue },
      })
      setAllowExplicit(newValue)
      toast.success('Explicit content preference updated.')
      await refetch({ fetchPolicy: 'network-only' })
    } catch (err) {
      toast.error('Failed to update explicit content preference.')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className='p-6'>Loading account preferences...</div>
  }

  if (error) {
    return (
      <div className='p-6'>Unable to load preferences. Please try again.</div>
    )
  }

  return (
    <div className='flex items-center justify-center bg-background min-h-screen'>
      <div className='w-full max-w-lg rounded-lg p-6 shadow-lg bg-componentBackground my-6'>
        <h2 className='text-2xl font-bold mb-4'>Account Preferences</h2>
        <div className='space-y-4'>
          <div>
            <p className='font-medium'>Explicit Content</p>
            <p className='text-sm text-muted-foreground mb-2'>
              Allow mature content after age verification.
            </p>
            <div className='flex items-center gap-3'>
              <span>{allowExplicit ? 'Enabled' : 'Disabled'}</span>
              <Button
                onClick={handleToggleExplicit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : allowExplicit ? 'Disable' : 'Enable'}
              </Button>
            </div>
            {!me?.ageVerified && (
              <p className='text-sm text-red-500 mt-2'>
                You need to verify that you are 18+ before enabling explicit
                content.
              </p>
            )}
          </div>

          <div className='border-t border-muted-foreground pt-4'>
            <p className='font-medium'>Age Verification</p>
            <p className='text-sm text-muted-foreground mb-2'>
              Verify your age (18+) to control explicit content preference.
            </p>
            <input
              type='date'
              value={dobValue}
              onChange={(e) => setDobValue(e.target.value)}
              className='w-full p-2 border rounded-md mb-2'
            />
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Age'}
            </Button>
            {me?.ageVerified && (
              <p className='text-sm text-success mt-2'>Age verified ✓</p>
            )}
          </div>

          <div className='border-t border-muted-foreground pt-4'>
            <p className='font-medium'>Future notifications</p>
            <p className='text-sm text-muted-foreground'>
              Email notification settings will appear here soon.
            </p>
          </div>

          <Button
            variant='outlined'
            onClick={() => router.push('/profile')}
          >
            Back to Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
