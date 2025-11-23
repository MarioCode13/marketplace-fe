import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'cross-fetch'

// Create a new ApolloClient per call to avoid sharing an InMemoryCache
// between separate server requests. Sharing a singleton client can cause
// stale data to leak between requests in a long-running Node process.
export function getServerApolloClient(reqHeaders?: Record<string, string>) {
    const httpLink = new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`,
        fetch,
        headers: {
            // Forward authorization header and cookies when present
            ...(reqHeaders?.authorization ? { Authorization: reqHeaders.authorization } : {}),
            ...(reqHeaders?.cookie ? { Cookie: reqHeaders.cookie } : {}),
        },
    })

    return new ApolloClient({
        ssrMode: true,
        link: httpLink,
        cache: new InMemoryCache(),
    })
}
