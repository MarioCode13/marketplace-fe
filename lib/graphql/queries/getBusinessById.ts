import { gql } from '@apollo/client'

export const GET_BUSINESS_BY_ID = gql`
  query GetBusinessById($id: ID!) {
    business(id: $id) {
      id
      name
      slug
      email
      contactNumber
      addressLine1
      addressLine2
      postalCode
      planType
      owner {
        id
        planType
      }
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
        logoUrl
        bannerUrl
        themeColor
        lightOrDark
        primaryColor
        secondaryColor
        textColor
        cardTextColor
        backgroundColor
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