import { gql } from '@apollo/client'

export const GET_USER_REVIEWS = gql`
  query GetUserReviews($userId: ID!) {
    getUserReviews(userId: $userId) {
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

export const GET_USER_POSITIVE_REVIEWS = gql`
  query GetUserPositiveReviews($userId: ID!) {
    getUserPositiveReviews(userId: $userId) {
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

export const GET_USER_NEGATIVE_REVIEWS = gql`
  query GetUserNegativeReviews($userId: ID!) {
    getUserNegativeReviews(userId: $userId) {
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

export const GET_USER_AVERAGE_RATING = gql`
  query GetUserAverageRating($userId: ID!) {
    getUserAverageRating(userId: $userId)
  }
`

export const GET_USER_REVIEW_COUNT = gql`
  query GetUserReviewCount($userId: ID!) {
    getUserReviewCount(userId: $userId)
  }
`

export const GET_USER_POSITIVE_REVIEW_COUNT = gql`
  query GetUserPositiveReviewCount($userId: ID!) {
    getUserPositiveReviewCount(userId: $userId)
  }
` 