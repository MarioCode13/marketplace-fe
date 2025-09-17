import { gql } from '@apollo/client'

export const GET_STORE_BY_SLUG_FULL = gql`
  query GetStoreBySlugFull($slug: String!) {
    storeBySlug(slug: $slug) {
      id
      username
      planType
      business{
        id
      }
      storeBranding { 
        logoUrl
        bannerUrl
        themeColor
        lightOrDark
        primaryColor
        secondaryColor
        backgroundColor
        textColor
        cardTextColor
        about
        storeName
      }
      trustRating {
        starRating
        trustLevel
        overallScore
        totalReviews
        positiveReviews
      }
      listings {
        id
        title
        description
        price
        images
        condition
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
        createdAt
        expiresAt
        sold
      }
    }
  }
` 