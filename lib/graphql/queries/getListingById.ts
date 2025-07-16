import { gql } from '@apollo/client'

export const GET_LISTING_BY_ID = gql`
  query GetListingById($id: ID!) {
    getListingById(id: $id) {
      id
      title
      description
      images
      price
      sold
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      createdAt
      user {
        id
        username 
        profileImageUrl
        email
      }
    }
  }
`;