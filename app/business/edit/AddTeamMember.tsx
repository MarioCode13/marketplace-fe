import { useState } from 'react'
// import { useMutation } from '@apollo/client';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  useGetAllUsersQuery,
  useLinkUserToBusinessMutation,
  BusinessUserRole,
} from '@/lib/graphql/generated'

export default function AddTeamMember({ businessId }: { businessId: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { data: usersData, loading: usersLoading } = useGetAllUsersQuery()
  const [linkUserToBusiness] = useLinkUserToBusinessMutation()

  const handleAdd = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Find user by email
      const user = usersData?.getAllUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )
      if (!user) {
        setError('No user found with that email')
        setLoading(false)
        return
      }
      await linkUserToBusiness({
        variables: {
          businessId,
          userId: user.id,
          role: BusinessUserRole.Manager,
        },
      })
      setSuccess('Team member invited successfully!')
      setEmail('')
    } catch (err) {
      setError((err as Error).message || 'Failed to invite team member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <Input
        type='email'
        placeholder='Enter user email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading || usersLoading}
      />
      <Button
        variant='outlined'
        onClick={handleAdd}
        disabled={loading || usersLoading || !email}
      >
        {loading ? 'Inviting...' : 'Add Team Member'}
      </Button>
      {error && <div className='text-red-600 text-sm'>{error}</div>}
      {success && <div className='text-green-600 text-sm'>{success}</div>}
    </div>
  )
}
