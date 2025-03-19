import { gql } from '@apollo/client'

export const GET_CONDITIONS = gql`
  query GetConditions {
    getConditions
  }
`