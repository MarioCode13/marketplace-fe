import { gql } from '@apollo/client'

export const ADMIN_SAVE_SUBSCRIPTION_PROMO_COUPON = gql`
  mutation AdminSaveSubscriptionPromoCoupon(
    $input: AdminSubscriptionPromoCouponInput!
  ) {
    adminSaveSubscriptionPromoCoupon(input: $input) {
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

export const ADMIN_DELETE_SUBSCRIPTION_PROMO_COUPON = gql`
  mutation AdminDeleteSubscriptionPromoCoupon($id: ID!) {
    adminDeleteSubscriptionPromoCoupon(id: $id)
  }
`

export const ADMIN_SAVE_LISTING_BOOST_PROMO_COUPON = gql`
  mutation AdminSaveListingBoostPromoCoupon(
    $input: AdminListingBoostPromoCouponInput!
  ) {
    adminSaveListingBoostPromoCoupon(input: $input) {
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

export const ADMIN_DELETE_LISTING_BOOST_PROMO_COUPON = gql`
  mutation AdminDeleteListingBoostPromoCoupon($id: ID!) {
    adminDeleteListingBoostPromoCoupon(id: $id)
  }
`
