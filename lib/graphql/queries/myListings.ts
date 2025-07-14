import { gql } from '@apollo/client'

export const MY_LISTINGS = gql`
  query MyListings($limit: Int, $offset: Int) {
  myListings(limit: $limit, offset: $offset) {
    listings {
      id
      title
      description
      images
      price
      location
      condition
      createdAt
      sold
      user {
        id
        username
        trustRating {
          overallScore
          starRating
          trustLevel
          totalReviews
          positiveReviews
        }
      }
    }
    totalCount
  }
}
`

