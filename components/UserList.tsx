'use client'

import { RootState } from '@/store/store'
import { gql, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      email
    }
  }
`

export default function UserList() {
  const { loading, error, data } = useQuery(GET_ALL_USERS)
  const loggedIn = useSelector((state: RootState) => state.auth.token)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold'>Users</h1>
      <h1 className='text-xl font-bold'>
        {loggedIn ? 'Logged In' : 'Logged Out'}
      </h1>
      <ul className='mt-4 space-y-2'>
        {data?.getAllUsers.map(
          (user: { id: string; username: string; email: string }) => (
            <li
              key={user.id}
              className='p-2 border rounded-md'
            >
              <p className='font-semibold'>{user.username}</p>
              <p className='text-sm text-gray-500'>{user.email}</p>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
