'use client'

import React from 'react'
import LoadingListings from './loading'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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
    // Add global click listener for pagination and filter actions
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for pagination buttons
      const paginationButton = target.closest('button[data-pagination]')
      if (paginationButton && !paginationButton.hasAttribute('disabled')) {
        setIsNavigating(true)
        return
      }

      // Check for filter actions
      const filterActionButton = target.closest('button[data-filter-action]')
      if (filterActionButton && !filterActionButton.hasAttribute('disabled')) {
        setIsNavigating(true)
        return
      }

      // Check for Apply Filters button in the drawer
      const applyButton = target.closest('button')
      if (
        applyButton?.getAttribute('type') === 'submit' &&
        applyButton.closest('[role="dialog"]')
      ) {
        setIsNavigating(true)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (isNavigating) {
    return <LoadingListings />
  }

  return <>{children}</>
}
