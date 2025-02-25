'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { logout } from '@/store/authSlice'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'

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

  const { refetch } = useQuery(GET_PROFILE)

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
    router.push('/')
  }

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) {
  //     console.log('No image attached')
  //     return
  //   }
  //   // Pass the file to the upload function
  //   // onUpload(file)
  // }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${user.id}/profile-image`,
        {
          method: 'POST',
          body: formData,
          // headers: {
          //   Authorization: `Bearer ${yourAuthToken}`,
          // },
        }
      )

      if (response.ok) {
        toast.dismiss() // Remove loading toast
        toast.success('Profile image updated!')
        await refetch() // Refresh profile image
      } else {
        toast.dismiss()
        toast.error('Upload failed. Please try again.')
      }
    } catch (err) {
      toast.dismiss()
      toast.error(`Something went wrong. ${err}`)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md rounded-lg p-6 shadow-lg bg-componentBackground'>
        <h2 className='mb-4 text-2xl font-bold text-foreground'>Profile</h2>
        <div className='relative flex justify-center items-center w-full mb-3'>
          <label className='relative w-[140px] h-[140px] cursor-pointer'>
            <Image
              src={
                user.profileImage
                  ? `data:image/png;base64,${user.profileImage}`
                  : '/default-profile.png'
              }
              alt='profile'
              className='rounded-full w-[140px] h-[140px] object-cover'
              width={140}
              height={140}
            />

            {/* Hidden file input */}
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => handleFileChange(e)}
            />

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full transition-opacity ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Pencil className='text-white' />
            </div>
          </label>
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
