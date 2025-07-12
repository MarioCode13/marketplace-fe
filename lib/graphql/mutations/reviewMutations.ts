import { gql } from '@apollo/client'

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $transactionId: ID!
    $reviewedUserId: ID!
    $rating: Float!
    $comment: String
  ) {
    createReview(
      transactionId: $transactionId
      reviewedUserId: $reviewedUserId
      rating: $rating
      comment: $comment
    ) {
      id
      reviewer {
        id
        username
        profileImageUrl
      }
      reviewedUser {
        id
        username
        profileImageUrl
      }
      transaction {
        id
        listing {
          id
          title
        }
        salePrice
        saleDate
      }
      rating
      comment
      isPositive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $rating: Float!, $comment: String) {
    updateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
      id
      reviewer {
        id
        username
        profileImageUrl
      }
      reviewedUser {
        id
        username
        profileImageUrl
      }
      transaction {
        id
        listing {
          id
          title
        }
        salePrice
        saleDate
      }
      rating
      comment
      isPositive
      createdAt
      updatedAt
    }
  }
`

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
` 