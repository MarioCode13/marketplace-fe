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
        verificationScore
        profileScore
        reviewScore
        transactionScore
        totalReviews
        positiveReviews
        starRating
        trustLevel
      }
      profileCompletion {
        id
        hasProfilePhoto
        hasBio
        hasContactNumber
        hasLocation
        hasIdDocument
        hasDriversLicense
        hasProofOfAddress
        completionPercentage
        createdAt
        updatedAt
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
`

export const GET_MY_STORE_BRANDING = gql`
  query GetMyStoreBranding($userId: ID!) {
    user(id: $userId) {
      id
      planType
      storeBranding {
        slug
        logoUrl
        bannerUrl
        themeColor
        primaryColor
        secondaryColor
        lightOrDark
        about
        storeName
      }
    }
  }
`;

