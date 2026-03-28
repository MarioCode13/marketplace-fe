'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
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

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target) return

      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor || !anchor.href) return

      const linkUrl = new URL(anchor.href, window.location.href)
      const isInternal = linkUrl.origin === window.location.origin
      const samePageHash =
        linkUrl.pathname === window.location.pathname &&
        linkUrl.search === window.location.search

      if (
        isInternal &&
        !samePageHash &&
        anchor.target !== '_blank' &&
        !anchor.hasAttribute('download')
      ) {
        setIsNavigating(true)
        NProgress.start()
      }
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (!isNavigating) return

    NProgress.done()
    setIsNavigating(false)
  }, [pathname, isNavigating])

  return <>{children}</>
}
