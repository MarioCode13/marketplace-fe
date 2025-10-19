import { gql } from '@apollo/client'

export const SEND_INVITATION = gql`
  mutation SendInvitation($businessId: ID!, $recipientEmail: String!, $role: BusinessUserRole!) {
    sendInvitation(businessId: $businessId, recipientEmail: $recipientEmail, role: $role) {
      id
      recipientEmail
      role
      status
      createdAt
    }
  }
`


