import { gql } from '@apollo/client'
import type { PlanType } from '@/lib/graphql/generated'

export const GET_ME = gql`
  query Me {
    me {
      id
      username
      email
      firstName
      lastName
      bio
      profileImageUrl
      planType
      proStoreSevenDayBoostsRemainingThisMonth
      boostCreditBalances {
        durationDays
        available
        bySource {
          source
          available
        }
      }
      referralCode
      referralSignupsRewardedThisMonth
      referralSignupsRemainingThisMonth
      role
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
      customCity
      contactNumber
      idNumber
      subscription {
        id
        status
        planType
        amount
        billingCycle
        currentPeriodStart
        currentPeriodEnd
        cancelAtPeriodEnd
        cancelledAt
      }
      trustRating {
        verifiedId
      }
      profileCompletion {
        completionPercentage
      }
    }
  }
`

/** Result type for {@link GET_ME} — run `npm run codegen` to sync with generated hooks. */
export type MeQuery = {
  __typename?: 'Query'
  me?: {
    __typename?: 'User'
    id: string
    username: string
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    profileImageUrl?: string | null
    planType?: PlanType | null
    proStoreSevenDayBoostsRemainingThisMonth?: number | null
    boostCreditBalances: Array<{
      __typename?: 'BoostCreditBalance'
      durationDays: number
      available: number
      bySource: Array<{
        __typename?: 'BoostCreditSourceBalance'
        source: string
        available: number
      }>
    }>
    referralCode?: string | null
    referralSignupsRewardedThisMonth?: number | null
    referralSignupsRemainingThisMonth?: number | null
    role: string
    city?: {
      __typename?: 'City'
      id: string
      name: string
      region?: {
        __typename?: 'Region'
        name: string
        country: { __typename?: 'Country'; name: string }
      } | null
    } | null
    customCity?: string | null
    contactNumber?: string | null
    idNumber?: string | null
    subscription?: {
      __typename?: 'Subscription'
      id: string
      status: string
      planType: PlanType
      amount: number
      billingCycle: string
      currentPeriodStart?: string | null
      currentPeriodEnd?: string | null
      cancelAtPeriodEnd?: boolean | null
      cancelledAt?: string | null
    } | null
    trustRating?: { __typename?: 'TrustRating'; verifiedId: boolean } | null
    profileCompletion?: {
      __typename?: 'ProfileCompletion'
      completionPercentage: number
    } | null
  } | null
}

export type MeQueryVariables = Record<string, never>
