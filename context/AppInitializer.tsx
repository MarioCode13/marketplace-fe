// context/AppInitializer.tsx
'use client'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  refetchUserProfile,
  refetchBusinessContext,
} from '@/store/userContextSlice'

import { AppDispatch } from '@/store/store'

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
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
        // Always clear state if not authenticated
        dispatch({ type: 'userContext/logout' })
        if (typeof window !== 'undefined') {
          localStorage.setItem('loggedOut', 'true')
          window.location.href = '/'
        }
      }
    })
  }, [dispatch])

  return null
}
