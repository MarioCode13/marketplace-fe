import { gql } from '@apollo/client'

export const GET_BUSINESS_TRUST_RATING = gql`
  query BusinessTrustRating($businessId: ID!) {
    businessTrustRating(businessId: $businessId) {
      averageRating
      reviewCount
    }
  }
`
