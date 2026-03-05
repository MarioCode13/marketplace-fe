import { gql } from '@apollo/client'

export const APPROVE_LISTING = gql`
  mutation ApproveListing($approvalQueueId: ID!, $approvalNotes: String) {
    approveListing(
      approvalQueueId: $approvalQueueId
      approvalNotes: $approvalNotes
    ) {
      id
      status
      approvalNotes
      listing {
        id
        nsfwApprovalStatus
      }
    }
  }
`

export const DECLINE_LISTING = gql`
  mutation DeclineListing($approvalQueueId: ID!, $declineReason: String!) {
    declineListing(
      approvalQueueId: $approvalQueueId
      declineReason: $declineReason
    ) {
      id
      status
      approvalNotes
      listing {
        id
        nsfwApprovalStatus
      }
    }
  }
`

