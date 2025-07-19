import { gql } from '@apollo/client'
import { TrustRating } from '../types/trust'

export const GET_TRUST_RATING = gql`
  query GetTrustRating($userId: ID!) {
    getTrustRating(userId: $userId) {
      id
      userId
      overallScore
      verificationScore
      profileScore
      reviewScore
      transactionScore
      totalReviews
      positiveReviews
      totalTransactions
      successfulTransactions
      lastCalculated
      createdAt
      updatedAt
      starRating
      trustLevel
    }
  }
`

export interface GetTrustRatingData {
  getTrustRating: TrustRating
}

export interface GetTrustRatingVars {
  userId: string
} 