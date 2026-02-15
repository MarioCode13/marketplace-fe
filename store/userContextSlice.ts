import { createAction, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getApolloClient } from '@/lib/apollo/client'
// No longer using GraphQL for login; handled by backend REST
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { Business } from '@/lib/graphql/generated'
import { MeQuery } from '@/lib/graphql/generated'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.dealio.org.za"

// Thunk to handle login flow
export const loginUser = createAsyncThunk(
	'userContext/loginUser',
	async (form: { emailOrUsername: string; password: string }, { dispatch, rejectWithValue }) => {
		try {
			// Call backend REST login; backend sets httpOnly cookies + CSRF
			const cookieRes = await fetch(`${API_BASE}/api/auth/login`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})

			console.log('[loginUser] Response status:', cookieRes.status)

			if (!cookieRes.ok) {
				// Try to parse error message from response
				let errorMsg = 'Login failed'
				try {
					const errorData = await cookieRes.json()
					console.log('[loginUser] Error response data:', errorData)
					errorMsg = errorData.message || errorData.error || 'Login failed'
					console.log('[loginUser] Extracted error message:', errorMsg)
				} catch (parseErr) {
					console.log('[loginUser] Failed to parse error response:', parseErr)
					errorMsg = 'Login failed'
				}
				return rejectWithValue(errorMsg)
			}

			// Refetch user profile and business context
			await dispatch(refetchUserProfile())
			await dispatch(refetchBusinessContext())
			return 'success'
		} catch (err) {
			console.log('[loginUser] Caught error:', err)
			const errorMsg = err instanceof Error ? err.message : 'Login failed. Please try again.'
			console.log('[loginUser] Final error message:', errorMsg)
			return rejectWithValue(errorMsg)
		}
	}
)



// Thunk to handle logout flow
export const logoutUser = createAsyncThunk(
	'userContext/logoutUser',
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const client = getApolloClient()

			// Call backend REST logout; backend clears httpOnly cookies
			const logoutRes = await fetch(`${API_BASE}/api/auth/logout`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
			})

			// Clear Apollo cache and dispatch logout action regardless of response status
			dispatch(logout())
			await client.clearStore()

			if (!logoutRes.ok) {
				console.warn('Logout API returned non-ok status, but still clearing local state')
			}

			return 'success'
		} catch (err) {
			// Even if logout fails, clear local state to allow user to log in again
			const client = getApolloClient()
			dispatch(logout())
			await client.clearStore()
			const errorMsg = err instanceof Error ? err.message : 'Logout failed'
			console.warn('Logout error:', errorMsg)
			return rejectWithValue(errorMsg)
		}
	}
)

export const selectIsLoggedIn = (state: { userContext: { userId: string | null } }) => !!state.userContext.userId

// Thunk to refetch user profile and update userContext
export const refetchUserProfile = createAsyncThunk(
	'userContext/refetchUserProfile',
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const client = getApolloClient()
			const { data } = await client.query<MeQuery>({
				query: GET_ME,
				fetchPolicy: 'network-only',
			})
			console.log('[refetchUserProfile] GET_ME result:', data)
			if (data?.me && data.me.id) {
				// Populate all user fields from GET_ME result (including cityId from city)
				const cityId = data.me.city?.id ?? null
				const userContextPayload: Partial<UserContextState> = {
					userId: data.me.id,
					username: data.me.username ?? null,
					role: (data.me.role as UserRole) ?? null,
					profileImageUrl: data.me.profileImageUrl ?? null,
					email: data.me.email ?? null,
					planType: data.me.planType ?? null,
					cityId: cityId ?? null,
				}
				userContextPayload.isBusinessOwner = data.me.role === 'OWNER' || data.me.role === 'ADMIN'
				userContextPayload.canEditListing = true // or your logic
				userContextPayload.canViewBusinessTransactions = true // or your logic
				console.log('[refetchUserProfile] [LOGIN PERSISTENCE] Dispatching setUserContext:', userContextPayload)
				dispatch(setUserContext(userContextPayload))
				return data.me
			} else {
				// Only clear context if GET_ME returns null or missing id
				console.log('[refetchUserProfile] [LOGIN PERSISTENCE] No user data returned, clearing user context')
				dispatch(clearUserContext())
				return rejectWithValue('Failed to fetch user profile')
			}
		} catch (error: unknown) {
			console.log('[refetchUserProfile] Error:', error)
			if (error instanceof Error) {
				return rejectWithValue(error.message || 'Failed to fetch user profile')
			}
			return rejectWithValue('Failed to fetch user profile')
		}
	}
)

// Thunk to refetch business context and update userContext
export const refetchBusinessContext = createAsyncThunk(
	'userContext/refetchBusinessContext',
	async (_, { dispatch, getState, rejectWithValue }) => {
		try {
			const client = getApolloClient()
			const { data } = await client.query({
				query: GET_MY_BUSINESS,
				fetchPolicy: 'network-only',
			})
			console.log('[refetchBusinessContext] GET_MY_BUSINESS result:', data)
			const business = data?.myBusiness
			if (business) {
				const state = getState() as import('@/store/store').RootState
				const currentUserId = state?.userContext?.userId
				// Merge with existing user context
				const prevUserContext = state?.userContext || {}
				let isBusinessUser = false
				let isBusinessOwner = false
				if (business.businessUsers && Array.isArray(business.businessUsers) && currentUserId) {
					console.log('[refetchBusinessContext] businessUsers:', business.businessUsers)
					console.log('[refetchBusinessContext] currentUserId:', currentUserId)
					isBusinessUser = (business.businessUsers as Array<{ user: { id: string } }>).
						some((bu: { user: { id: string } }) => {
							const match = bu.user.id === currentUserId
							console.log('[refetchBusinessContext] Checking businessUser:', bu.user.id, 'match:', match)
							return match
						})
				}
				const ownerUser = business.businessUsers.find(
					(bu: { role: string; user: { id: string } }) => bu.role === "OWNER"
				)
				isBusinessOwner = Boolean(ownerUser && ownerUser.user.id === currentUserId)
				console.log('[refetchBusinessContext] ownerUser:', ownerUser)
				console.log('[refetchBusinessContext] isBusinessOwner:', isBusinessOwner)
				console.log('[refetchBusinessContext] isBusinessUser:', isBusinessUser)
				// Merge previous user context with new business context, avoiding duplicate keys
				const mergedContext = {
					...prevUserContext,
					business: business,
					businessId: business.id,
					businessName: business.name,
					isBusinessUser,
					isBusinessOwner,
					planType: business.planType || prevUserContext.planType || null,
					// Add other business fields as needed
				}
				dispatch(setUserContext(mergedContext))
				console.log('[refetchBusinessContext] setUserContext dispatched:', mergedContext)
				return business
			} else {
				// No business found: only clear business-related fields, preserve user login context
				console.log('[refetchBusinessContext] No business found, clearing only business-related fields')
				const state = getState() as import('@/store/store').RootState
				const prevUserContext = state?.userContext || {}
				const mergedContext = {
					...prevUserContext,
					business: null,
					businessId: null,
					businessName: null,
					isBusinessUser: false,
					isBusinessOwner: false,
				}
				dispatch(setUserContext(mergedContext))
				return null
			}
		} catch (error: unknown) {
			console.log('[refetchBusinessContext] Error:', error)
			if (error instanceof Error) {
				return rejectWithValue(error.message || 'Failed to fetch business context')
			}
			return rejectWithValue('Failed to fetch business context')
		}
	}
)


export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'USER' | 'GUEST'

export interface UserContextState {
	userId: string | null
	username: string | null
	email?: string | null
	planType?: string | null
	cityId?: string | null
	profileCompletion?: {
		complete?: boolean
		completionPercentage?: number
	} | null
	businessId: string | null
	businessName: string | null
	role: UserRole | null
	isBusinessUser: boolean
	isBusinessOwner: boolean
	canEditListing: boolean
	canViewBusinessTransactions: boolean
	business: Business | null
	profileImageUrl?: string | null
}

const initialState: UserContextState = {
	userId: null,
	username: null,
	email: null,
	planType: null,
	cityId: null,
	businessId: null,
	businessName: null,
	role: null,
	isBusinessUser: false,
	isBusinessOwner: false,
	canEditListing: false,
	canViewBusinessTransactions: false,
	business: null,
	profileImageUrl: null,
}

const userContextSlice = createSlice({
	name: 'userContext',
	initialState,
	reducers: {
		setUserContext(state, action: PayloadAction<Partial<UserContextState>>) {
			Object.assign(state, action.payload)
		},
		clearUserContext(state) {
			Object.assign(state, initialState)
		},
		logout(state) {
			Object.assign(state, initialState)
		},
		setBusinessRole(state, action: PayloadAction<UserRole>) {
			state.role = action.payload
			state.isBusinessOwner =
				action.payload === 'OWNER' || action.payload === 'ADMIN'
			state.isBusinessUser = !!state.businessId
		},
		setPermissions(state, action: PayloadAction<Partial<UserContextState>>) {
			Object.assign(state, action.payload)
		},
	},
	extraReducers: (builder) => {
		builder.addCase(updateUserProfileImage, (state, action: PayloadAction<{ userId: string; url: string }>) => {
			if (state.userId === action.payload.userId) {
				state.profileImageUrl = action.payload.url
			}
		})
	},
})

// Action to update user profile image URL
export const updateUserProfileImage = createAction<{ userId: string; url: string }>('userContext/updateUserProfileImage')

export const {
	setUserContext,
	clearUserContext,
	logout,
	setBusinessRole,
	setPermissions,
} = userContextSlice.actions
export default userContextSlice.reducer
