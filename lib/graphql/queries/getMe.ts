import { gql } from '@apollo/client'

export const GET_ME = gql`
  query Me {
    me {
      id
      username
      email
      firstName
      lastName
      bio
      profileImageUrl
      planType
      role
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
      contactNumber
      idNumber
      subscription {
        status
        planType
      }
      trustRating{
        verifiedId
      }
    }
  }
` 