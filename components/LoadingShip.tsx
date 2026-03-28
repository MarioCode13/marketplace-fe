'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function LoadingShip() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Show ship when route starts changing
    setIsVisible(true)

    // Hide ship after route has changed (short delay)
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!isVisible) return null

  return (
    <div className='fixed top-3 left-1/2 -translate-x-1/2 z-[1032] pointer-events-none animate-fade-out'>
      <div className='animate-sail'>
        {/* <Image
          src='/loading-ship.svg'
          alt='Loading'
          width={40}
          height={40}
          priority
          className='drop-shadow-lg'
        /> */}
      </div>
    </div>
  )
}
