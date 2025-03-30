import { gql } from '@apollo/client'

export const MY_LISTINGS = gql`
  query MyListings {
  myListings {
    id
    title
    description
    images
    price
    location
    condition
    createdAt
    sold
  }
}
`