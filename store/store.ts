import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import userContextReducer from './userContextSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		userContext: userContextReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
