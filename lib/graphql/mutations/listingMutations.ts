import { gql } from '@apollo/client'

export const DELETE_LISTING = gql`
 mutation DeleteListing($listingId: ID!) {
  deleteListing(listingId: $listingId) 
}
`

export const LISTING_BOOST_CHECKOUT_URL = gql`
  mutation ListingBoostCheckoutUrl($listingId: ID!, $durationDays: Int!) {
    listingBoostCheckoutUrl(listingId: $listingId, durationDays: $durationDays)
  }
`

export const UPDATE_LISTING = gql`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      title
      description
      price
      quantity
      images
      condition
      nsfwFlagged
      nsfwApprovalStatus
      category {
        id
        name
      }
      city {
        id
        name
      }
      customCity
    }
  }
`