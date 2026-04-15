import { configureStore } from '@reduxjs/toolkit'
import userContextReducer, { UserContextState } from './userContextSlice'

function loadPersistedUserContext(): Partial<UserContextState> | undefined {
	if (typeof window === 'undefined') return undefined
	try {
		const raw = localStorage.getItem('userContext')
		if (raw) return JSON.parse(raw)
	} catch {
		// Corrupted data — ignore
	}
	return undefined
}

const persistedUserContext = loadPersistedUserContext()

export const store = configureStore({
	reducer: {
		userContext: userContextReducer,
	},
	preloadedState: persistedUserContext
		? { userContext: { ...userContextReducer(undefined, { type: '@@INIT' }), ...persistedUserContext } }
		: undefined,
})

// Persist userContext to localStorage on every change
store.subscribe(() => {
	const state = store.getState().userContext
	try {
		localStorage.setItem('userContext', JSON.stringify(state))
	} catch {
		// Storage full or unavailable — ignore
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
