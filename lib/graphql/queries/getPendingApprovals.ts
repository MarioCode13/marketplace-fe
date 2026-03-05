import { gql } from '@apollo/client'

export const GET_PENDING_APPROVALS = gql`
  query GetPendingApprovals($page: Int, $size: Int) {
    getPendingApprovals(page: $page, size: $size) {
      items {
        id
        flagType
        status
        approvalNotes
        createdAt
        listing {
          id
          title
          nsfwFlagged
          nsfwApprovalStatus
          images
        }
      }
      totalCount
      pageNumber
      pageSize
      hasNextPage
    }
  }
`

