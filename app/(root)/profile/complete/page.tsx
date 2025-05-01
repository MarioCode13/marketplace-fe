'use client'

import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
// import { toast } from 'sonner'

const GET_PROFILE = gql`
  query Me {
    me {
      id
      username
      firstName
      lastName
      bio
      location
    }
  }
`

// const COMPLETE_PROFILE = gql`
//   mutation CompleteProfile(
//     $id: ID!
//     $firstName: String!
//     $lastName: String!
//     $bio: String
//     $location: String
//   ) {
//     updateUser(
//       id: $id
//       firstName: $firstName
//       lastName: $lastName
//       bio: $bio
//       location: $location
//     ) {
//       id
//     }
//   }
// `

export default function CompleteProfilePage() {
  //   const router = useRouter()
  const { loading, error } = useQuery(GET_PROFILE)
  //   const [completeProfile] = useMutation(COMPLETE_PROFILE)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading profile</p>

  //   const user = data.me

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault()

  //     try {
  //       await completeProfile({
  //         variables: {
  //           id: user.id,
  //           ...form,
  //         },
  //       })
  //       toast.success('Profile updated successfully')
  //       router.push('/profile')
  //     } catch (err) {
  //       toast.error('Something went wrong. Try again.')
  //     }
  //   }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-4 text-2xl font-bold text-foreground'>
          Complete Your Profile
        </h2>

        <form
          //   onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              name='firstName'
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              name='lastName'
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='location'>Location</Label>
            <Input
              id='location'
              name='location'
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              name='bio'
              value={form.bio}
              onChange={handleChange}
              placeholder='Tell us a bit about yourself'
            />
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Save & Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
