import { gql } from '@apollo/client'

export const GET_MY_PURCHASES = gql`
  query GetMyPurchases {
    myPurchases {
      id
      listing {
        id
        title
        description
        images
        price
        location
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

export const GET_MY_SALES = gql`
  query GetMySales {
    mySales {
      id
      listing {
        id
        title
        description
        images
        price
        location
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

export const GET_MY_COMPLETED_PURCHASES = gql`
  query GetMyCompletedPurchases {
    myCompletedPurchases {
      id
      listing {
        id
        title
        description
        images
        price
        location
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

export const GET_MY_COMPLETED_SALES = gql`
  query GetMyCompletedSales {
    myCompletedSales {
      id
      listing {
        id
        title
        description
        images
        price
        location
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

export const GET_TRANSACTION = gql`
  query GetTransaction($transactionId: ID!) {
    getTransaction(transactionId: $transactionId) {
      id
      listing {
        id
        title
        description
        images
        price
        location
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

export const GET_MY_REVIEW_FOR_TRANSACTION = gql`
  query GetMyReviewForTransaction($transactionId: ID!) {
    getMyReviewForTransaction(transactionId: $transactionId) {
      id
      reviewer {
        id
        username
        profileImageUrl
      }
      reviewedUser {
        id
        username
        profileImageUrl
      }
      transaction {
        id
        listing {
          id
          title
        }
        salePrice
        saleDate
      }
      rating
      comment
      isPositive
      createdAt
      updatedAt
    }
  }
` 