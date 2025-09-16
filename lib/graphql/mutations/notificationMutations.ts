import { gql } from '@apollo/client'

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId)
  }
`

export const ACCEPT_BUSINESS_INVITATION = gql`
  mutation AcceptBusinessInvitation($notificationId: ID!) {
    acceptBusinessInvitation(notificationId: $notificationId)
  }
`

export const DECLINE_BUSINESS_INVITATION = gql`
  mutation DeclineBusinessInvitation($notificationId: ID!) {
    declineBusinessInvitation(notificationId: $notificationId)
  }
`