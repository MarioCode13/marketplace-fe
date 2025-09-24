import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Business } from '@/lib/graphql/generated'

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
