// context/AppInitializer.tsx
'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  refetchUserProfile,
  refetchBusinessContext,
} from '@/store/userContextSlice'

import { AppDispatch } from '@/store/store'

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // In E2E tests, skip the redirect on failure but still fetch user profile
    // Playwright handles authentication via global setup and cookies
    const isE2E = process.env.NEXT_PUBLIC_E2E === 'true'

    // Prevent infinite loop after redirect by using localStorage
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('loggedOut') === 'true'
    ) {
      localStorage.removeItem('loggedOut')
      return
    }

    dispatch(refetchUserProfile()).then((result) => {
      console.log('[AppInitializer] refetchUserProfile result:', result)
      if (
        refetchUserProfile.fulfilled.match(result) &&
        result.payload &&
        result.payload.id
      ) {
        // Only refetch business context if user is authenticated
        dispatch(refetchBusinessContext()).then((bizResult) => {
          console.log(
            '[AppInitializer] refetchBusinessContext result:',
            bizResult
          )
        })
      } else {
        // In E2E tests, don't redirect; just clear state and let the test handle it
        if (isE2E) {
          console.log('[AppInitializer] User not authenticated in E2E mode, clearing state')
          dispatch({ type: 'userContext/logout' })
        } else {
          // Always clear state if not authenticated in normal mode
          dispatch({ type: 'userContext/logout' })
          if (typeof window !== 'undefined') {
            localStorage.setItem('loggedOut', 'true')
            window.location.href = '/'
          }
        }
      }
    })
  }, [dispatch])

  return null
}
