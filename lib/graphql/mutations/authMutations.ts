import { gql } from '@apollo/client'

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      email
      role
      userId
    }
  }
`

export const CHECK_USERNAME_AVAILABLE = gql`
  query CheckUsernameAvailable($username: String!) {
    checkUsernameAvailable(username: $username)
  }
`
