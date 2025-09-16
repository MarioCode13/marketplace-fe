
import { gql } from '@apollo/client'

export const UPDATE_STORE_BRANDING = gql`
	mutation UpdateStoreBranding($businessId: ID!, $input: UpdateStoreBrandingInput!) {
  updateStoreBranding(businessId: $businessId, input: $input) {
    slug
    logoUrl
    bannerUrl
    themeColor
    primaryColor
    secondaryColor
    lightOrDark
    about
    storeName
    textColor
    cardTextColor
  }
}
`

export const CREATE_BUSINESS = gql`
	mutation CreateBusiness($input: CreateBusinessInput!) {
		createBusiness(input: $input) {
			id
			name
			email
			contactNumber
			addressLine1
			addressLine2
			city {
				id
				name
			}
			postalCode
			slug
			storeBranding {
				slug
				logoUrl
				bannerUrl
				themeColor
				primaryColor
				secondaryColor
				lightOrDark
				about
				storeName
				textColor
				cardTextColor
			}
		}
	}
`

export const LINK_USER_TO_BUSINESS = gql`
	mutation LinkUserToBusiness($businessId: ID!, $userId: ID!, $role: BusinessUserRole!) {
		linkUserToBusiness(businessId: $businessId, userId: $userId, role: $role) {
			id
			role
			user {
				id
				username
				email
			}
		}
	}
`

export const UNLINK_USER_FROM_BUSINESS = gql`
	mutation UnlinkUserFromBusiness($businessId: ID!, $userId: ID!) {
		unlinkUserFromBusiness(businessId: $businessId, userId: $userId)
	}
`
