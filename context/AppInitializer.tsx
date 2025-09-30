// context/AppInitializer.tsx
'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  refetchUserProfile,
  refetchBusinessContext,
} from '@/store/userContextSlice'
import { fetchUserProfile } from '@/store/authSlice'

import { AppDispatch } from '@/store/store'

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>()
  // Removed unused getMyBusiness

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    console.log('[AppInitializer] Token in localStorage:', token)
    if (token) {
      dispatch(fetchUserProfile()).then((authResult) => {
        console.log('[AppInitializer] fetchUserProfile result:', authResult)
        dispatch(refetchUserProfile()).then((result) => {
          console.log('[AppInitializer] refetchUserProfile result:', result)
          if (refetchUserProfile.fulfilled.match(result)) {
            dispatch(refetchBusinessContext()).then((bizResult) => {
              console.log(
                '[AppInitializer] refetchBusinessContext result:',
                bizResult
              )
            })
          }
        })
      })
    } else {
      console.log(
        '[AppInitializer] No token found, skipping context population.'
      )
    }
  }, [dispatch])

  return null
}
