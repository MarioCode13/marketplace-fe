import { gql } from '@apollo/client'

export const GET_LISTINGS = gql`
  query GetListings(
    $limit: Int!, 
    $offset: Int!, 
    $categoryId: ID, 
    $minPrice: Float, 
    $maxPrice: Float,
    $condition: Condition,
    $location: String,
    $searchTerm: String,
    $minDate: String,
    $maxDate: String,
    $sortBy: String,
    $sortOrder: String
  ) {
    getListings(
      limit: $limit, 
      offset: $offset, 
      categoryId: $categoryId, 
      minPrice: $minPrice, 
      maxPrice: $maxPrice,
      condition: $condition,
      location: $location,
      searchTerm: $searchTerm,
      minDate: $minDate,
      maxDate: $maxDate,
      sortBy: $sortBy,
      sortOrder: $sortOrder
    ) {
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
