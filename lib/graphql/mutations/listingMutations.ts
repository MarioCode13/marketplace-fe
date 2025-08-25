import { gql } from '@apollo/client'

export const DELETE_LISTING = gql`
 mutation DeleteListing($id: ID!) {
  deleteListing(id: $id) 
}
`

export const UPDATE_LISTING = gql`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      title
      description
      price
      images
      condition
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