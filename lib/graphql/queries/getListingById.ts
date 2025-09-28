import { gql } from '@apollo/client'

export const GET_LISTING_BY_ID = gql`
  query GetListingById($id: ID!) {
    getListingById(id: $id) {
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
      category{
        id
        name
        parentId
      }
      customCity
      condition
      createdAt
      user {
        id
        username 
        profileImageUrl
        email
        planType
      }
      business {
        id
        name
        businessType
        slug  
         trustRating {
          averageRating
           reviewCount
         }
        storeBranding {
          storeName
          logoUrl
        
          
        }
      }
    }
  }
`