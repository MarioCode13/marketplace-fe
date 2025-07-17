import { gql } from '@apollo/client'

export const GET_SELLER_PROFILE = gql`
  query GetSellerProfile($id: ID!) {
    user(id: $id) {
      id
      username
      email
      createdAt
      profileImageUrl
      firstName
      lastName
      bio
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
      contactNumber
      trustRating {
        overallScore
        documentScore
        profileScore
        reviewScore
        transactionScore
        totalReviews
        positiveReviews
        starRating
        trustLevel
      }
      profileCompletion {
        hasProfilePhoto
        hasVerifiedEmail
        hasVerifiedPhone
        hasIdVerification
      }
      subscription {
        planType
      }
      storeBranding {
        slug
        logoUrl
        bannerUrl
        themeColor
        about
      }
      listings {
        id
        title
        price
        images
        sold
        createdAt
      }
    }
  }
`; 