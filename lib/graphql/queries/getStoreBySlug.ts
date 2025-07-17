import { gql } from '@apollo/client';

export const GET_STORE_BY_SLUG = gql`
  query GetStoreBySlug($slug: String!) {
    storeBySlug(slug: $slug) {
      id
      username
      planType
      storeBranding {
        slug
        logoUrl
        bannerUrl
        themeColor
        about
        storeName
      }
      trustRating {
        starRating
        trustLevel
      }
      listings {
        id
        title
        price
        images
        condition
        city { name }
        customCity
        createdAt
      }
    }
  }
`;

export default GET_STORE_BY_SLUG; 