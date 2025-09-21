'use client'

import { useQuery } from '@apollo/client'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ProfileBusinessEditPage() {
  const { data, loading, error } = useQuery(GET_MY_BUSINESS)
  const router = useRouter()
  const business = data?.myBusiness

  if (loading) return <div>Loading business details...</div>
  if (error) return <div>Error loading business details.</div>
  if (!business) return <div>No business found.</div>

  // TODO: Add business edit form and mutations here
  return (
    <div className='max-w-2xl mx-auto mt-10 p-6 bg-componentBackground rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4'>Edit Business Profile</h2>
      <div className='mb-4'>
        <div>
          <strong>Name:</strong> {business.name}
        </div>
        <div>
          <strong>Email:</strong> {business.email}
        </div>
        {/* Add more business fields and editing UI here */}
      </div>
      <Button
        variant='outlined'
        onClick={() => router.back()}
      >
        Back
      </Button>
    </div>
  )
}
