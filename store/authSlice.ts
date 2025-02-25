import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { gql } from '@apollo/client'
import { jwtDecode } from 'jwt-decode'
import client from '@/context/apollo-client'

// GraphQL Login Mutation
const LOGIN_MUTATION = gql`
  mutation Login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password) {
      token
      email
      role
    }
  }
`

type DecodedToken = {
    id: string
    username: string
    role: 'VISITOR' | 'HAS_ACCOUNT' | 'SUBSCRIBED'
    exp: number
}

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ emailOrUsername, password }: { emailOrUsername: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: LOGIN_MUTATION,
                variables: { emailOrUsername, password },
            })
            localStorage.setItem('token', data.login.token) // Save token to localStorage
            return data.login
        } catch (error: any) { // eslint-disable-line
            return rejectWithValue(error.message)
        }
    }
)

// 🔹 Get token from localStorage and decode it
const getInitialAuthState = () => {
    if (typeof window === 'undefined') return { token: null, user: null }

    const token = localStorage.getItem('token')
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token)
            return { token, user: decoded }
        } catch (error) {
            console.error('Invalid token:', error)
            localStorage.removeItem('token') // Remove invalid token
        }
    }
    return { token: null, user: null }
}

// 🔹 Load token from localStorage on initial state
const initialState = {
    ...getInitialAuthState(),
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null, // Prevents SSR issues
    loading: false,
    error: null as string | null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null
            state.user = null
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.token
                try {
                    state.user = jwtDecode(action.payload.token) // Decode and store user info
                } catch (error) {
                    console.error('Error decoding token:', error)
                    state.user = null
                }
                state.loading = false
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
