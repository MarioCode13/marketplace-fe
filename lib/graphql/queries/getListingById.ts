import { gql } from '@apollo/client'

export const GET_LISTING_BY_ID = gql`
  query GetListingById($id: ID!) {
    getListingById(id: $id) {
      id
      title
      description
      images
      price
      location
      condition
      createdAt
      user {
        username 
        profileImageUrl
        email
      }
    }
  }
`