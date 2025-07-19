import { gql } from '@apollo/client'

export const GET_STORE_BY_SLUG_MINIMAL = gql`
  query GetStoreBySlugMinimal($slug: String!) {
    storeBySlug(slug: $slug) {
      id
      username
      planType
      storeBranding {
        slug
        storeName
        logoUrl
      }
    }
  }
` 