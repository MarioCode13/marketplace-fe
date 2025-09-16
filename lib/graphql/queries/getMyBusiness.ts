import { gql } from '@apollo/client'

export const GET_MY_BUSINESS = gql`
  query GetMyBusiness {
    myBusiness {
      id
      name
      email
      contactNumber
      addressLine1
      addressLine2
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
      postalCode
      storeBranding {
        slug
        logoUrl
        bannerUrl
        themeColor
        primaryColor
        secondaryColor
        lightOrDark
        about
        storeName
        textColor
        cardTextColor
        backgroundColor
      }
      businessUsers {
        id
        role
        user {
          id
          username
          email
          profileImageUrl
        }
      }
    }
  }
`
