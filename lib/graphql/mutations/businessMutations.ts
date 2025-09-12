import { gql } from '@apollo/client'

export const UPDATE_BUSINESS_AND_BRANDING = gql`
  mutation UpdateBusinessAndBranding(
    $business: UpdateBusinessInput!
    $branding: UpdateStoreBrandingInput!
  ) {
    updateBusinessAndBranding(business: $business, branding: $branding) {
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
      }
    }
  }
`

export const CREATE_BUSINESS = gql`
  mutation CreateBusiness(
    $name: String!
    $email: String!
    $contactNumber: String
    $addressLine1: String
    $addressLine2: String
    $cityId: ID
    $postalCode: String
  ) {
    createBusiness(
      name: $name
      email: $email
      contactNumber: $contactNumber
      addressLine1: $addressLine1
      addressLine2: $addressLine2
      cityId: $cityId
      postalCode: $postalCode
    ) {
      id
      name
      email
      contactNumber
      addressLine1
      addressLine2
      city {
        id
        name
      }
      postalCode
    }
  }
`

export const LINK_USER_TO_BUSINESS = gql`
  mutation LinkUserToBusiness($businessId: ID!, $userId: ID!, $role: String!) {
    linkUserToBusiness(businessId: $businessId, userId: $userId, role: $role) {
      id
      role
      user {
        id
        username
        email
      }
    }
  }
`

export const UNLINK_USER_FROM_BUSINESS = gql`
  mutation UnlinkUserFromBusiness($businessId: ID!, $userId: ID!) {
    unlinkUserFromBusiness(businessId: $businessId, userId: $userId)
  }
`
