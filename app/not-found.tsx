import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-lg rounded-lg bg-componentBackground p-8 text-center shadow-lg'>
        <h1 className='text-3xl font-bold text-foreground'>Page not found</h1>
        <p className='mt-3 text-muted-foreground'>
          The page you are looking for does not exist or may have moved.
        </p>
        <div className='mt-6'>
          <Link
            href='/'
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground'
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  )
}
