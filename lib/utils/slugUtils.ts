import { gql, ApolloClient } from '@apollo/client'

const reservedSlugs = [
    'listings', 'seller', 'api', 'business', 'store', 'login', 'register', 'profile', 'terms', 'privacy', 'transactions', 'verification', 'subscriptions', 'my-listings', 'edit-listing', 'public', 'components', 'context', 'lib', 'test-results', 'tests'
]

export const IS_STORE_SLUG_AVAILABLE = gql`
  query IsStoreSlugAvailable($slug: String!) {
    isStoreSlugAvailable(slug: $slug)
  }
`

export async function checkSlugAvailable(slug: string, client: ApolloClient<object>): Promise<{ valid: boolean; reason?: string }> {
    const lowerSlug = slug.trim().toLowerCase()
    if (reservedSlugs.includes(lowerSlug)) {
        return { valid: false, reason: 'This slug is reserved or already in use.' }
    }
    try {
        const { data } = await client.query({
            query: IS_STORE_SLUG_AVAILABLE,
            variables: { slug: lowerSlug },
            fetchPolicy: 'network-only',
        })
        if (!data.isStoreSlugAvailable) {
            return { valid: false, reason: 'This slug is already taken.' }
        }
        return { valid: true }
    } catch (err) {
        return { valid: false, reason: 'Error checking slug availability. ' + err }
    }
}
