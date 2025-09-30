import { createAction, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getApolloClient } from '@/lib/apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { Business } from '@/lib/graphql/generated'
import { MeQuery } from '@/lib/graphql/generated'
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
			if (data?.me) {
				// Populate all user fields from GET_ME result
				const userContextPayload: Partial<UserContextState> = {
					userId: data.me.id ?? null,
					username: data.me.username ?? null,
					role: (data.me.role as UserRole) ?? null,
					profileImageUrl: data.me.profileImageUrl ?? null,
					email: data.me.email ?? null,
					planType: data.me.planType ?? null,
				}
				// Only set isBusinessOwner based on role
				userContextPayload.isBusinessOwner = data.me.role === 'OWNER' || data.me.role === 'ADMIN'
				console.log('[refetchUserProfile] Dispatching setUserContext:', userContextPayload)
				dispatch(setUserContext(userContextPayload))
				return data.me
			} else {
				console.log('[refetchUserProfile] No user data returned')
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
				const currentUserId = state?.auth?.user?.id
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
					business: null,
					businessId: null,
					businessName: null,
					isBusinessUser: false,
					isBusinessOwner: false,
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
	setBusinessRole,
	setPermissions,
} = userContextSlice.actions
export default userContextSlice.reducer
