'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { logout } from '@/store/authSlice'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const GET_PROFILE = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $username: String!, $email: String!) {
    updateUser(id: $id, username: $username, email: $email) {
      id
      username
      email
    }
  }
`

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_PROFILE)
  const [updateProfile] = useMutation(UPDATE_PROFILE)

  const [form, setForm] = useState({ username: '', email: '' })
  const [editing, setEditing] = useState(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const user = data?.me

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = () => {
    setForm({ username: user.username, email: user.email })
    setEditing(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({ variables: { id: user.id, ...form } })
    setEditing(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-4 text-2xl font-bold text-foreground'>Profile</h2>
        {/* <img
          src={user.profilePicture || '/default-avatar.png'}
          alt='Profile'
          className='mb-4 h-24 w-24 rounded-full mx-auto'
        /> */}
        {editing ? (
          <form
            onSubmit={handleSubmit}
            className='space-y-4'
          >
            <div>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                name='username'
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type='submit'
              className='w-full'
            >
              Save Changes
            </Button>
          </form>
        ) : (
          <div>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <Button
              className='w-full mt-3'
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        )}
        {/* <h3 className='mt-6 text-lg font-semibold'>Listings</h3> */}
        {/* <ul className='mt-2'>
          {user.listings.length > 0 ? (
            user.listings.map((listing: any) => (
              <li
                key={listing.id}
                className='border-b py-2'
              >
                <strong>{listing.title}</strong>
                <p className='text-sm text-muted-foreground'>
                  {listing.description}
                </p>
              </li>
            ))
          ) : (
            <p>No listings found.</p>
          )}
        </ul> */}
        <Button
          variant='destructive'
          className='w-full mt-6'
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
