import { gql } from '@apollo/client'

export const GET_LISTINGS = gql`
  query GetListings(
    $limit: Int!, 
    $offset: Int!, 
    $categoryId: ID, 
    $minPrice: Float, 
    $maxPrice: Float,
    $condition: Condition,
    $cityId: ID,
    $searchTerm: String,
    $minDate: String,
    $maxDate: String,
    $sortBy: String,
    $sortOrder: String,
    $userId: ID
  ) {
    getListings(
      limit: $limit, 
      offset: $offset, 
      categoryId: $categoryId, 
      minPrice: $minPrice, 
      maxPrice: $maxPrice,
      condition: $condition,
      cityId: $cityId,
      searchTerm: $searchTerm,
      minDate: $minDate,
      maxDate: $maxDate,
      sortBy: $sortBy,
      sortOrder: $sortOrder,
      userId: $userId
    
    ) {
      listings {
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
        expiresAt
        category {
          id
          name
        }
        user {
          id
          username
          profileImageUrl
        }
      }
      totalCount
    }
  }
`
