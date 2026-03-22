import { gql } from '@apollo/client'

export const BOOSTED_HOME_LISTINGS = gql`
  query BoostedHomeListings($limit: Int) {
    boostedHomeListings(limit: $limit) {
      id
      title
      description
      images
      price
      sold
      condition
      createdAt
      city {
        id
        name
      }
      customCity
      user {
        id
        username
      }
      business {
        name
      }
    }
  }
`

export const LISTING_BOOST_PRICE_ZAR = gql`
  query ListingBoostPriceZar($durationDays: Int!) {
    listingBoostPriceZar(durationDays: $durationDays)
  }
`
