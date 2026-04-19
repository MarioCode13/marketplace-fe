import { gql } from '@apollo/client'

/** Same operation names as `generated.ts` (server fields stay `myWatchlist*`). */
export const MY_WISHLIST_LISTING_IDS = gql`
  query MyWatchlistListingIds {
    myWatchlistListingIds
  }
`

export const MY_WISHLIST = gql`
  query MyWatchlist($limit: Int, $offset: Int) {
    myWatchlist(limit: $limit, offset: $offset) {
      totalCount
      listings {
        id
        title
        description
        images
        price
        sold
        nsfwApprovalStatus
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
        condition
        createdAt
        expiresAt
        category {
          id
          name
        }
        user {
          id
          username
          profileImageUrl
          trustRating {
            verifiedId
            starRating
            totalReviews
          }
        }
        business {
          name
          trustRating {
            verifiedWithThirdParty
            averageRating
            reviewCount
          }
        }
      }
    }
  }
`
