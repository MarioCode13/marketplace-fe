import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
})

export const {
	setUserContext,
	clearUserContext,
	setBusinessRole,
	setPermissions,
} = userContextSlice.actions

export default userContextSlice.reducer
