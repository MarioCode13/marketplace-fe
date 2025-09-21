import { gql } from '@apollo/client'

export const UPDATE_BUSINESS = gql`
  mutation UpdateBusiness($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      id
      name
      email
      contactNumber
      addressLine1
      addressLine2
      postalCode
    }
  }
`
