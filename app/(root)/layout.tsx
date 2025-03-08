import React from 'react'

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 max-w-7xl mx-auto '>
      {children}
    </main>
  )
}
