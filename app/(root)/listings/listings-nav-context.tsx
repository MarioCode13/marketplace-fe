'use client'

import { createContext, useContext } from 'react'

export const ListingsNavPendingContext = createContext(false)

export function useListingsNavPending() {
  return useContext(ListingsNavPendingContext)
}
