import { gql } from '@apollo/client'

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: ID!) {
    notifications(userId: $userId) {
      id
      message
      type
      read
      actionRequired
      data
      createdAt
      user {
        id
        username
      }
    }
  }
`