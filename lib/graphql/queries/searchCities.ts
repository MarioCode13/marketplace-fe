import { gql } from '@apollo/client';

export const SEARCH_CITIES = gql`
  query SearchCities($query: String!) {
    searchCities(query: $query) {
      id
      name
      region {
        id
        name
        country {
          id
          name
          code
        }
      }
    }
  }
`; 