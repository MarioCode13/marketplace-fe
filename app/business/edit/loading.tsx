export default function Loading() {
  return (
    <div className='py-6 max-w-5xl mx-auto px-4'>
      <div className='h-8 w-56 bg-gray-200 rounded animate-pulse mb-2' />
      <div className='h-4 w-96 bg-gray-200 rounded animate-pulse mb-6' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className='h-4 w-32 bg-gray-200 rounded animate-pulse mb-1' />
              <div className='h-10 w-full bg-gray-200 rounded animate-pulse' />
            </div>
          ))}
        </div>
        <div className='space-y-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className='h-4 w-32 bg-gray-200 rounded animate-pulse mb-1' />
              <div className='h-10 w-full bg-gray-200 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
