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
import Image from 'next/image'
import { Pencil } from 'lucide-react'

const GET_PROFILE = gql`
  query Me {
    me {
      id
      username
      email
      profileImage
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
  const [hovered, setHovered] = useState(false)

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

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // You can now send the file to your mutation
      // onUpload(file);
      return
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-4 text-2xl font-bold text-foreground'>Profile</h2>
        <div
          className='flex justify-center items-center w-full mb-3'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={`data:image/png;base64,${user.profileImage}`}
            alt='profile'
            style={{ borderRadius: '50%' }}
            width={150}
            className='rounded-full w-[140px] h-[140px] object-cover'
            height={1}
          />
          {/* Hover Overlay */}
          {hovered && (
            <div className='absolute w-[140px] h-[140px] bg-black bg-opacity-50 rounded-full flex justify-center items-center cursor-pointer'>
              <Pencil className='text-white' />
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
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
