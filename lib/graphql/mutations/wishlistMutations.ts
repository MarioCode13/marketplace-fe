import { gql } from '@apollo/client'

export const ADD_TO_WISHLIST = gql`
  mutation AddToWatchlist($listingId: ID!) {
    addToWatchlist(listingId: $listingId)
  }
`

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWatchlist($listingId: ID!) {
    removeFromWatchlist(listingId: $listingId)
  }
`
