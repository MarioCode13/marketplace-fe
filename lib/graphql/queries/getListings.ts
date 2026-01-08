import { gql } from '@apollo/client'

export const GET_LISTINGS = gql`
  query GetListings(
    $limit: Int!,
    $offset: Int!,
    $categoryId: ID,
    $categorySlug: String,
    $minPrice: Float,
    $maxPrice: Float,
    $condition: Condition,
    $cityId: ID,
    $citySlug: String,
    $searchTerm: String,
    $minDate: String,
    $maxDate: String,
    $sortBy: String,
    $sortOrder: String,
    $userId: ID,
    $businessId: ID
  ) {
    getListings(
      limit: $limit,
      offset: $offset,
      categoryId: $categoryId,
      categorySlug: $categorySlug,
      minPrice: $minPrice,
      maxPrice: $maxPrice,
      condition: $condition,
      cityId: $cityId,
      citySlug: $citySlug,
      searchTerm: $searchTerm,
      minDate: $minDate,
      maxDate: $maxDate,
      sortBy: $sortBy,
      sortOrder: $sortOrder,
      userId: $userId,
      businessId: $businessId
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
          trustRating {
            verifiedId
            starRating
            totalReviews
          }
        }
        business{
          name
          trustRating {
            verifiedWithThirdParty
            averageRating
            reviewCount
          }
        }
      }
      totalCount
    }
  }
`
