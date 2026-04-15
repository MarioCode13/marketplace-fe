export default function ProfileLoading() {
  return (
    <div className='w-full flex justify-center'>
      <div className='w-full max-w-4xl py-16 px-6'>
        <div className='w-full max-w-md mx-auto rounded-lg p-6 shadow-lg bg-componentBackground animate-pulse'>
          <div className='h-8 w-24 bg-muted rounded mb-4' />
          <div className='flex justify-center mb-6'>
            <div className='w-[140px] h-[140px] rounded-full bg-muted' />
          </div>
          <div className='space-y-3'>
            <div className='h-5 w-40 bg-muted rounded' />
            <div className='h-5 w-48 bg-muted rounded' />
            <div className='h-5 w-36 bg-muted rounded' />
          </div>
          <div className='mt-4 h-10 w-full bg-muted rounded' />
          <div className='mt-3 h-10 w-full bg-muted rounded' />
        </div>
      </div>
    </div>
  )
}
