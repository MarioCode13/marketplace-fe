import { gql } from '@apollo/client'

export const DELETE_LISTING = gql`
 mutation DeleteListing($id: ID!) {
  deleteListing(id: $id) 
}
`