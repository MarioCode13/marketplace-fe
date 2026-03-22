'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const GET_ME_PREFERENCES = gql`
  query MeForPreferences {
    me {
      id
      eligibleForExplicitContent
      preferences {
        allowsExplicitContent
        emailMarketingOptIn
      }
      profileCompletion {
        completionPercentage
      }
    }
  }
`

const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($input: UserPreferencesInput!) {
    updateUserPreferences(input: $input) {
      id
      eligibleForExplicitContent
      preferences {
        allowsExplicitContent
        emailMarketingOptIn
      }
    }
  }
`

export default function ProfilePreferencesPage() {
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.userContext.userId)

  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
  }, [userId, router])

  const { data, loading, error, refetch } = useQuery(GET_ME_PREFERENCES, {
    fetchPolicy: 'network-only',
    skip: !userId,
  })

  const [updatePreferences] = useMutation(UPDATE_USER_PREFERENCES)

  const me = data?.me
  const [allowExplicit, setAllowExplicit] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingMarketing, setIsSavingMarketing] = useState(false)

  useEffect(() => {
    setAllowExplicit(me?.preferences?.allowsExplicitContent ?? false)
    setMarketingOptIn(me?.preferences?.emailMarketingOptIn ?? true)
  }, [me])

  const handleToggleExplicit = async () => {
    const next = !allowExplicit
    if (next && !me?.eligibleForExplicitContent) {
      toast.error(
        'Verify your South African ID (18+) in your profile before enabling explicit content.'
      )
      return
    }

    setIsSaving(true)
    try {
      const newValue = next
      await updatePreferences({
        variables: {
          input: { allowsExplicitContent: newValue },
        },
      })
      setAllowExplicit(newValue)
      toast.success('Explicit content preference updated.')
      await refetch()
    } catch (err) {
      toast.error('Failed to update explicit content preference.')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleMarketingChange = async (checked: boolean) => {
    setIsSavingMarketing(true)
    try {
      await updatePreferences({
        variables: { input: { emailMarketingOptIn: checked } },
      })
      setMarketingOptIn(checked)
      toast.success(
        checked
          ? 'You may receive occasional marketing emails from Dealio.'
          : 'Marketing emails are turned off.'
      )
      await refetch()
    } catch (err) {
      toast.error('Could not update email preference.')
      console.error(err)
    } finally {
      setIsSavingMarketing(false)
    }
  }

  if (!userId) {
    return null
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
              Allow mature content after your South African ID is verified and
              shows you are 18 or older.
            </p>
            <div className='flex items-center gap-3'>
              <span>{allowExplicit ? 'Enabled' : 'Disabled'}</span>
              <Button onClick={handleToggleExplicit} disabled={isSaving}>
                {isSaving ? 'Saving...' : allowExplicit ? 'Disable' : 'Enable'}
              </Button>
            </div>
            {!me?.eligibleForExplicitContent && (
              <p className='text-sm text-muted-foreground mt-2'>
                Complete ID verification on your profile with a valid SA ID
                number. We use your verified ID and the date encoded in your ID
                number to confirm you are 18+.
              </p>
            )}
            {me?.eligibleForExplicitContent && (
              <p className='text-sm text-success mt-2'>
                You are eligible to enable explicit content (verified ID, 18+).
              </p>
            )}
          </div>

          <div className='border-t border-muted-foreground pt-4'>
            <p className='font-medium'>Marketing emails</p>
            <p className='text-sm text-muted-foreground mb-3'>
              Tips, product news, and offers. Account and purchase-related
              emails are not affected.
            </p>
            <div className='flex items-start gap-3'>
              <Checkbox
                id='marketing-email'
                checked={marketingOptIn}
                disabled={isSavingMarketing}
                onCheckedChange={(v) => {
                  void handleMarketingChange(v === true)
                }}
              />
              <Label
                htmlFor='marketing-email'
                className='text-sm font-normal leading-snug cursor-pointer'
              >
                I agree to receive marketing emails from Dealio
              </Label>
            </div>
          </div>

          <Button variant='outlined' onClick={() => router.push('/profile')}>
            Back to Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
