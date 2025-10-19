'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BusinessUserRole } from '@/lib/graphql/generated'
import { useMutation } from '@apollo/client'
import { SEND_INVITATION } from '@/lib/graphql/mutations/invitationMutations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { formatEnum } from '@/lib/utils'

export default function AddTeamMember({ businessId }: { businessId: string }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<BusinessUserRole | null>(
    BusinessUserRole.Contributor
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [sendInvitation] = useMutation(SEND_INVITATION)

  const handleAdd = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Send invitation regardless of whether user exists yet
      await sendInvitation({
        variables: {
          businessId,
          recipientEmail: email,
          role: role as BusinessUserRole,
        },
      })
      setSuccess('Invitation sent successfully!')
      setEmail('')
      setRole(BusinessUserRole.Contributor)
    } catch (err) {
      setError((err as Error).message || 'Failed to invite team member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Responsive two-column layout */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <Label
            htmlFor='email'
            className='mb-1'
          >
            Email
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter user email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className='flex flex-col'>
          <Label
            htmlFor='role'
            className='mb-1'
          >
            Role
          </Label>
          <Select
            name='role'
            value={role ?? undefined}
            onValueChange={(value) => setRole(value as BusinessUserRole)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              {Object.values(BusinessUserRole).map((role) => (
                <SelectItem
                  key={role}
                  value={role}
                >
                  {formatEnum(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        variant='outlined'
        onClick={handleAdd}
        disabled={loading || !email || !role}
      >
        {loading ? 'Sending...' : 'Send Invitation'}
      </Button>

      {error && <p className='text-sm text-red-600'>{error}</p>}
      {success && <p className='text-sm text-green-600'>{success}</p>}
    </div>
  )
}
