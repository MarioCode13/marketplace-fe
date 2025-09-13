import { gql } from '@apollo/client'

export const GET_BUSINESS_BY_ID = gql`
  query GetBusinessById($id: ID!) {
    business(id: $id) {
      id
      name
      email
      contactNumber
      addressLine1
      addressLine2
      postalCode
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
      businessUsers {
        id
        role
        user {
          id
          username
          email
          profileImageUrl
          planType
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
    }
  }
`