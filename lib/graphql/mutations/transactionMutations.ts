import { gql } from '@apollo/client'

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $listingId: ID!
    $buyerId: ID!
    $salePrice: Float!
    $paymentMethod: String
    $notes: String
  ) {
    createTransaction(
      listingId: $listingId
      buyerId: $buyerId
      salePrice: $salePrice
      paymentMethod: $paymentMethod
      notes: $notes
    ) {
      id
      listing {
        id
        title
        description
        images
        price
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
        condition
        user {
          id
          username
          profileImageUrl
        }
      }
      seller {
        id
        username
        profileImageUrl
      }
      buyer {
        id
        username
        profileImageUrl
      }
      salePrice
      saleDate
      status
      paymentMethod
      notes
      createdAt
      updatedAt
    }
  }
`

export const COMPLETE_TRANSACTION = gql`
  mutation CompleteTransaction($transactionId: ID!) {
    completeTransaction(transactionId: $transactionId) {
      id
      status
      updatedAt
    }
  }
`

export const CANCEL_TRANSACTION = gql`
  mutation CancelTransaction($transactionId: ID!, $reason: String!) {
    cancelTransaction(transactionId: $transactionId, reason: $reason) {
      id
      status
      notes
      updatedAt
    }
  }
` 