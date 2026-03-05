import { gql } from '@apollo/client'

export const VALIDATE_SLUG = gql`
  query ValidateSlug($slug: String!, $excludeBusinessId: ID) {
    validateSlug(slug: $slug, businessId: $excludeBusinessId) {
        message
        similarTo
        similarity
        status 
    }
  }
`
