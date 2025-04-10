import React from 'react'

export default function SkeletonListingCard() {
  return (
    <div className='border p-4 rounded-lg shadow-lg animate-pulse w-full min-h-[300px] flex flex-col'>
      <div className='w-full h-40 bg-gray-300 rounded-md'></div>
      <div className='h-5 bg-gray-300 rounded mt-2 w-3/4'></div>
      <div className='h-10 bg-gray-300 rounded mt-2 w-5/6'></div>
      <div className='h-5 bg-gray-300 rounded mt-2 w-1/3'></div>
      <div className='h-4 bg-gray-300 rounded mt-2 w-1/2'></div>
    </div>
  )
}
