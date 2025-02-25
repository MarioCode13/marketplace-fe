'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store' // Adjust the path if needed
import Link from 'next/link'

export default function SellPage() {
  const token = useSelector((state: RootState) => state.auth.token)

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center'>
      {token ? (
        <div>
          <h1 className='text-2xl font-bold'>Welcome to the Buy Page</h1>
          <p>You can list your items for sale here.</p>
        </div>
      ) : (
        <div>
          <h1 className='text-2xl font-bold'>Please Log In</h1>
          <p>You need to be logged in to sell items.</p>
          <Link
            href='/login'
            className='text-blue-500 underline'
          >
            Go to Login
          </Link>
        </div>
      )}
    </div>
  )
}
