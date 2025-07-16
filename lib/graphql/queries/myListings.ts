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
        user {
          id
          username
          profileImageUrl
        }
      }
      totalCount
    }
  }
`;

