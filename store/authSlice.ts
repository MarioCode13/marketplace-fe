import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { gql } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'

import { jwtDecode } from 'jwt-decode'
import { getApolloClient } from '@/lib/apollo/client'
import { toast } from 'sonner'

// Get the Apollo Client instance
const getClient = () => getApolloClient()


const LOGIN_MUTATION = gql`
  mutation Login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password) {
      token
      email
      role
      userId
    }
  }
`

type DecodedToken = {
    id: string
    username: string
    role: 'VISITOR' | 'HAS_ACCOUNT' | 'SUBSCRIBED'
    exp: number
    userId: string
    email?: string
    planType?: string
    profileImageUrl?: string
    profileCompletion?: {
        complete?: boolean
        completionPercentage?: number
    }
    // Add other User fields as needed
}
// Thunk to fetch full user profile after login
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const client = getClient()
            const { data } = await client.query({
                query: GET_ME,
                fetchPolicy: 'network-only',
            })
            if (data?.me) {
                return data.me
            } else {
                return rejectWithValue('Failed to fetch user profile')
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch user profile')
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ emailOrUsername, password }: { emailOrUsername: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await getClient().mutate({
                mutation: LOGIN_MUTATION,
                variables: { emailOrUsername, password },
            })
            const token = data.login.token
            // Fetch full user data after login
            // You may need to run a GET_ME query here to get the full User object
            // For now, assume the token contains all user fields
            const decoded: DecodedToken = jwtDecode(token)
            localStorage.setItem('token', token)
            // After login, fetch full user profile
            return { token, user: decoded, fetchProfile: true }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                const graphQLError = error.graphQLErrors[0]
                const errorCode = graphQLError.extensions?.code
                switch (errorCode) {
                    case 'INVALID_CREDENTIALS':
                        return rejectWithValue('Invalid email/username or password')
                    case 'VALIDATION_ERROR':
                        return rejectWithValue(graphQLError.message || 'Please check your input and try again')
                    case 'AUTH_ERROR':
                        return rejectWithValue(graphQLError.message || 'Login failed. Please try again')
                    default:
                        return rejectWithValue(graphQLError.message || 'Login failed. Please try again')
                }
            } else {
                return rejectWithValue(error.message || 'Login failed. Please try again')
            }
        }
    }
)

const getInitialAuthState = () => {
    if (typeof window === 'undefined') return { token: null, user: null }

    try {
        const token = localStorage.getItem('token')
        if (token) {
            const decoded: DecodedToken = jwtDecode(token)
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token')
                return { token: null, user: null }
            }
            return { token, user: decoded }
        }
    } catch (error) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
        }
        toast.error('Error decoding token:' + (error instanceof Error ? error.message : ''))
    }
    return { token: null, user: null }
}



const initialState = {
    ...getInitialAuthState(),
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
            getClient().clearStore()

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
                    state.user = {
                        ...action.payload.user
                    }
                } catch (error) {
                    toast.error('Error decoding token:' + (error instanceof Error ? error.message : ''))
                    state.user = null
                }
                state.loading = false
                // If login succeeded, trigger fetchUserProfile thunk
                // This should be dispatched from the component after login
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.error = action.payload as string
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
