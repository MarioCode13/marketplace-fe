import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      email
      profileImageUrl
      firstName
      lastName
      location
      trustRating {
        overallScore
        starRating
        trustLevel
        totalReviews
        totalTransactions
        successfulTransactions
      }
    }
  }
`

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      id
      username
      email
      profileImageUrl
      firstName
      lastName
      location
      trustRating {
        overallScore
        starRating
        trustLevel
        totalReviews
        totalTransactions
        successfulTransactions
      }
    }
  }
` 