'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
}

function ProgressTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
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

  return null
}

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ProgressTracker />\
      </Suspense>
      {children}
    </>
  )
}
