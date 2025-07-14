import React from 'react'

export default function SkeletonListingCard() {
  return (
    <div className='border border-secondary p-4 rounded-lg shadow-lg animate-pulse w-full min-h-[300px] flex flex-col bg-componentBackground'>
      <div className='w-full h-40 bg-gray-300 rounded-md'></div>
      <div className='h-6 bg-gray-300 rounded mt-2 w-3/4'></div>
      <div className='h-12 bg-gray-300 rounded mt-2 w-full'></div>
      <div className='h-5 bg-gray-300 rounded mt-2 w-1/4'></div>
      <div className='mt-2 space-y-1'>
        <div className='h-4 bg-gray-300 rounded w-1/2'></div>
        <div className='flex items-center gap-2'>
          <div className='h-3 bg-gray-300 rounded w-4'></div>
          <div className='h-3 bg-gray-300 rounded w-8'></div>
        </div>
      </div>
      <div className='h-4 bg-gray-300 rounded mt-2 w-1/3'></div>
    </div>
  )
}
