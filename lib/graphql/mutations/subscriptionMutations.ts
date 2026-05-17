import { gql } from '@apollo/client'

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription {
    cancelSubscription {
      id
      status
      planType
      cancelAtPeriodEnd
      currentPeriodEnd
    }
  }
`

export const REACTIVATE_SUBSCRIPTION = gql`
  mutation ReactivateSubscription {
    reactivateSubscription {
      id
      status
      planType
      cancelAtPeriodEnd
      currentPeriodEnd
    }
  }
`
