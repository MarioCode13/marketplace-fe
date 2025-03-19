import { gql } from '@apollo/client'

export const GET_LISTINGS = gql`
  query GetListings($limit: Int!, $offset: Int!, $categoryId: ID, $minPrice: Float, $maxPrice: Float) {
  getListings(limit: $limit, offset: $offset, categoryId: $categoryId, minPrice: $minPrice, maxPrice: $maxPrice) {
    listings {
      id
      title
      description
      images
      category {
        id
        name
      }
      price
      sold
      location
      condition
      createdAt
      expiresAt
      user {
        id
        username
      }
    }
    totalCount
  }
}
`
