import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers {
    getAllUsers {
      id
      username
      email
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
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
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
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