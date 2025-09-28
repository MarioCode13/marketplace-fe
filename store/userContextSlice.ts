import { createAction, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getApolloClient } from '@/lib/apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import { GET_MY_BUSINESS } from '@/lib/graphql/queries/getMyBusiness'
import { Business } from '@/lib/graphql/generated'
// Thunk to refetch user profile and update userContext
export const refetchUserProfile = createAsyncThunk(
	'userContext/refetchUserProfile',
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const client = getApolloClient()
			const { data } = await client.query({
				query: GET_ME,
				fetchPolicy: 'network-only',
			})
			if (data?.me) {
				dispatch(setUserContext({
					userId: data.me.id,
					username: data.me.username,
					role: data.me.role,
					profileImageUrl: data.me.profileImageUrl,
					// Add other user fields as needed
				}))
				return data.me
			} else {
				return rejectWithValue('Failed to fetch user profile')
			}
		} catch (error: unknown) {
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
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const client = getApolloClient()
			const { data } = await client.query({
				query: GET_MY_BUSINESS,
				fetchPolicy: 'network-only',
			})
			const business = data?.myBusiness
			if (business) {
				dispatch(setUserContext({
					business: business,
					businessId: business.id,
					businessName: business.name,
					// Add other business fields as needed
				}))
				return business
			} else {
				// Clear business context if not found
				dispatch(setUserContext({
					business: null,
					businessId: null,
					businessName: null,
				}))
				return null
			}
		} catch (error: unknown) {
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
