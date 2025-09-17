import { gql } from '@apollo/client'

export const GET_BUSINESS_BY_SLUG = gql`
  query GetBusinessBySlug($slug: String!) {
    getBusinessBySlug(slug: $slug) {
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
        logoUrl
        bannerUrl
        themeColor
        lightOrDark
        primaryColor
        secondaryColor
        about
        storeName
        backgroundColor
        textColor
        cardTextColor
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