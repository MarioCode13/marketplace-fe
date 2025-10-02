import { configureStore } from '@reduxjs/toolkit'
import userContextReducer from './userContextSlice'

export const store = configureStore({
	reducer: {
		userContext: userContextReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
