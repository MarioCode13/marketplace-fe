import { gql } from '@apollo/client'

export const GET_ADMIN_SUBSCRIPTION_PROMO_COUPONS = gql`
  query AdminSubscriptionPromoCoupons {
    adminSubscriptionPromoCoupons {
      id
      code
      discountType
      percentOff
      amountOff
      maxRedemptions
      expiresAt
      active
      applicablePlanTypes
      createdAt
    }
  }
`

export const GET_ADMIN_LISTING_BOOST_PROMO_COUPONS = gql`
  query AdminListingBoostPromoCoupons {
    adminListingBoostPromoCoupons {
      id
      code
      discountType
      percentOff
      amountOff
      maxRedemptions
      expiresAt
      active
      applicableDurationDays
      createdAt
    }
  }
`
