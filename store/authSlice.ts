import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { gql } from '@apollo/client'
import { jwtDecode } from 'jwt-decode'
import client from '@/context/apollo-client'


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
}


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ emailOrUsername, password }: { emailOrUsername: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: LOGIN_MUTATION,
                variables: { emailOrUsername, password },
            })
            const token = data.login.token

            const decoded: DecodedToken = jwtDecode(token)

            localStorage.setItem('token', token)

            return { token, user: decoded }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Handle specific GraphQL error codes
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
                console.log('Token expired')
                localStorage.removeItem('token')
                return { token: null, user: null }
            }
            return { token, user: decoded }
        }
    } catch (error) {
        console.error('Error accessing localStorage or decoding token:', error)
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
        }
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
            client.clearStore()

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login successful, payload:', action.payload)
                state.token = action.payload.token
                try {
                    state.user = {
                        ...action.payload.user,
                        userId: action.payload.user.userId
                    }
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
