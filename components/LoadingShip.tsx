'use client'

import Image from 'next/image'

export default function LoadingShip({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div className='fixed top-3 left-1/2 -translate-x-1/2 z-[1032] pointer-events-none animate-fade-out'>
      <div className='animate-sail'>
        <Image
          src='/loading-ship.svg'
          alt='Loading'
          width={40}
          height={40}
          priority
          className='drop-shadow-lg'
        />
      </div>
    </div>
  )
}
