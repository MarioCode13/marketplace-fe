import { gql } from '@apollo/client'

export const DELETE_LISTING = gql`
 mutation DeleteListing($listingId: ID!) {
  deleteListing(listingId: $listingId) 
}
`