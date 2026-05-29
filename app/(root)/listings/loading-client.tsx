'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ListingsNavPendingContext } from './listings-nav-context'

export default function ClientLoadingWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button[data-pagination]') &&
        !target.closest('button[disabled]')
      ) {
        setIsNavigating(true)
        return
      }
      if (
        target.closest('button[data-filter-action]') &&
        !target.closest('button[disabled]')
      ) {
        setIsNavigating(true)
        return
      }
      if (
        target.closest('button[data-filter-nav]') &&
        !target.closest('button[disabled]')
      ) {
        setIsNavigating(true)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <ListingsNavPendingContext.Provider value={isNavigating}>
      {children}
    </ListingsNavPendingContext.Provider>
  )
}
