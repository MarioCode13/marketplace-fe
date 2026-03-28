'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
// @ts-expect-error - nprogress CSS import types not available
import 'nprogress/nprogress.css'
import LoadingShip from '@/components/LoadingShip'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 300,
  minimum: 0.1,
  trickle: true,
  trickleSpeed: 200,
})

// Expose NProgress to window for debugging
if (typeof window !== 'undefined') {
  ;(window as Window & typeof globalThis).__NProgress = NProgress
  console.log('NProgress initialized:', NProgress)
}

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('Route changed to:', pathname)
    NProgress.start()

    // Complete the progress when route changes (page loaded)
    const timer = setTimeout(() => {
      NProgress.done()
    }, 400)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [pathname, searchParams])

  return (
    <>
      <LoadingShip />
      {children}
    </>
  )
}
