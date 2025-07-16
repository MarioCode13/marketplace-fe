import { gql } from '@apollo/client'

export const GET_SELLER_PROFILE = gql`
  query GetSellerProfile($id: ID!) {
    user(id: $id) {
      id
      username
      email
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
      hasLocation: city { id } # or use a computed field in the backend if needed
    }
  }
`; 