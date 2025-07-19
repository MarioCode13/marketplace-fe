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
`;

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

export const UPDATE_STORE_BRANDING = gql`
  mutation UpdateStoreBranding($id: ID!, $slug: String, $logoUrl: String, $bannerUrl: String, $themeColor: String, $primaryColor: String, $secondaryColor: String, $lightOrDark: String, $about: String, $storeName: String) {
    updateStoreBranding(id: $id, slug: $slug, logoUrl: $logoUrl, bannerUrl: $bannerUrl, themeColor: $themeColor, primaryColor: $primaryColor, secondaryColor: $secondaryColor, lightOrDark: $lightOrDark, about: $about, storeName: $storeName) {
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