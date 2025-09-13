import { gql } from '@apollo/client'

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      planType
      storeBranding {
        slug
        logoUrl
        bannerUrl
        themeColor
        lightOrDark
        primaryColor
        secondaryColor
        about
        storeName
      }
      trustRating {
        starRating
        trustLevel
        overallScore
        totalReviews
        totalTransactions
        successfulTransactions
      }
    }
  }
`