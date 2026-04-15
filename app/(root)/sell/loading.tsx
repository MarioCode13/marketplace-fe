export default function Loading() {
  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='h-8 w-48 bg-gray-200 rounded animate-pulse mb-6' />

      <div className='space-y-5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse mb-1' />
            <div className='h-10 w-full bg-gray-200 rounded animate-pulse' />
          </div>
        ))}
        <div className='h-32 w-full bg-gray-200 rounded animate-pulse' />
        <div className='h-10 w-32 bg-gray-200 rounded animate-pulse' />
      </div>
    </div>
  )
}
