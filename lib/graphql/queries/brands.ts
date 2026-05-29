import { gql } from '@apollo/client'

export const BRANDS_BY_CATEGORY = gql`
  query BrandsByCategory($categoryId: ID!) {
    brandsByCategory(categoryId: $categoryId) {
      id
      name
      slug
    }
  }
`

export const SEARCH_BRANDS = gql`
  query SearchBrands($categoryId: ID!, $query: String!) {
    searchBrands(categoryId: $categoryId, query: $query) {
      id
      name
      slug
    }
  }
`
