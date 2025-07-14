import { gql } from '@apollo/client'

export const GET_SELLER_PROFILE = gql`
  query GetSellerProfile($userId: ID!) {
    user(id: $userId) {
      id
      username
      email
      firstName
      lastName
      bio
      location
      contactNumber
      profileImageUrl
      role
      createdAt
      profileCompletion {
        hasProfilePhoto
        hasBio
        hasContactNumber
        hasLocation
        hasVerifiedEmail
        hasVerifiedPhone
        hasIdVerification
        hasAddressVerification
        completionPercentage
      }
      trustRating {
        overallScore
        documentScore
        profileScore
        reviewScore
        transactionScore
        totalReviews
        positiveReviews
        totalTransactions
        successfulTransactions
      }
      verificationDocuments {
        id
        documentType
        status
        verifiedAt
      }
      subscription {
        planType
        status
        currentPeriodEnd
      }
    }
    
    reviews: reviewsByUser(userId: $userId) {
      id
      rating
      comment
      isPositive
      createdAt
      reviewer {
        id
        username
        firstName
        lastName
        profileImageUrl
      }
      transaction {
        id
        listing {
          id
          title
          price
        }
      }
    }
    
    sellerListings: listingsByUser(userId: $userId) {
      id
      title
      description
      price
      condition
      location
      sold
      createdAt
      expiresAt
      category {
        id
        name
      }
      images
    }
  }
` 