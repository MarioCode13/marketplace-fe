// context/AppInitializer.tsx
'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLazyQuery } from '@apollo/client'
import { fetchUserProfile } from '@/store/authSlice'
import { setUserContext } from '@/store/userContextSlice'
import { AppDispatch } from '@/store/store'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>()
  const [getMyBusiness] = useLazyQuery(GET_MY_BUSINESS)

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.fulfilled.match(result)) {
          const user = result.payload
          getMyBusiness().then(({ data }) => {
            const business = data?.myBusiness
            dispatch(
              setUserContext({
                userId: user.id,
                username: user.username,
                role: user.role,
                profileImageUrl: user.profileImageUrl,
                business: business || null,
                businessId: business?.id || null,
                businessName: business?.name || null,
                // Add other business-related fields as needed
              })
            )
          })
        }
      })
    }
  }, [dispatch, getMyBusiness])

  return null
}
