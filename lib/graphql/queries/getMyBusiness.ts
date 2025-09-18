import { gql } from '@apollo/client'

export const GET_MY_BUSINESS = gql`
  query GetMyBusiness {
    myBusiness {
      id
      slug
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
          planType
          username
          email
          profileImageUrl
        }
      }
    }
  }
`
