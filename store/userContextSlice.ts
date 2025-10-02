import { createAction, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getApolloClient } from '@/lib/apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { Business } from '@/lib/graphql/generated'
import { MeQuery } from '@/lib/graphql/generated'

// Thunk to handle login flow
export const loginUser = createAsyncThunk(
	'userContext/loginUser',
	async (form: { emailOrUsername: string; password: string }, { dispatch, rejectWithValue }) => {
		try {
			// Call login API
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/auth/login`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(form),
					credentials: 'include',
				}
			)
			if (!res.ok) throw new Error('Login failed')
			
			// After login, call /api/csrf to set CSRF token cookie
			const csrfRes = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_URL}/api/csrf`, {
				credentials: 'include',
				method: 'GET'
			})
			
			if (csrfRes.ok) {
				const csrfToken = await csrfRes.text()
				console.log('CSRF token received:', csrfToken)
				console.log('CSRF token cookie should be set now')
			} else {
				console.warn('Failed to get CSRF token')
			}

			// Refetch user profile and business context
			await dispatch(refetchUserProfile())
			await dispatch(refetchBusinessContext())
			return 'success'
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Login failed. Please try again.'
			return rejectWithValue(errorMsg)
		}
	}
)



// Thunk to handle logout flow
export const logoutUser = createAsyncThunk(
	'userContext/logoutUser',
	async (_, { dispatch, getState }) => {
		function getCookie(name: string): string | undefined {
			const value = `; ${document.cookie}`
			const parts = value.split(`; ${name}=`)
			if (parts.length === 2) {
				const part = parts.pop()
				if (part) return part.split(';').shift()
			}
			return undefined
		}
		const xsrfToken = getCookie('XSRF-TOKEN')
		const state = getState() as { userContext: { userId: string | null } }
		const isLoggedIn = !!state.userContext.userId
		const client = getApolloClient()
		console.log('LOGGING OUT')

		if (!isLoggedIn) {
			console.log('Not logged in or no CSRF token, clearing state and redirecting')
			console.log('isLoggedIn:', isLoggedIn, 'xsrfToken:', xsrfToken)

			// If not logged in or no CSRF token, just clear state and redirect
			dispatch(logout())
			await client.clearStore()
			window.location.href = '/login'
			return
		}

		const headers: HeadersInit = { 'Content-Type': 'application/json' }
		if (xsrfToken) {
			headers['X-XSRF-TOKEN'] = xsrfToken
		}
		const res = await fetch('/api/logout', {
			method: 'POST',
			credentials: 'include',
			headers,
		})
		if (res.ok) {
			dispatch(logout())
			await client.clearStore()
			window.location.href = '/login'
		} else {
			alert('Logout failed')
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
				// Populate all user fields from GET_ME result
				const userContextPayload: Partial<UserContextState> = {
					userId: data.me.id,
					username: data.me.username ?? null,
					role: (data.me.role as UserRole) ?? null,
					profileImageUrl: data.me.profileImageUrl ?? null,
					email: data.me.email ?? null,
					planType: data.me.planType ?? null,
					// Add any other fields needed for UI/permissions
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
				// Clear business context if not found
				console.log('[refetchBusinessContext] No business found, clearing context')
				dispatch(setUserContext({
					...initialState
				}))
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
	businessId: null,
	businessName: null,
	role: null,
	isBusinessUser: false,
	isBusinessOwner: false,
	canEditListing: false,
	canViewBusinessTransactions: false,
	business: null,
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
