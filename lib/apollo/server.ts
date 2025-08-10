import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'cross-fetch'

let clientInstance: ApolloClient<unknown> | null = null

export function getServerApolloClient(reqHeaders?: Record<string, string>) {
    if (!clientInstance) {
        const httpLink = new HttpLink({
            uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`,
            fetch,
            headers: {
                // Forward authorization header
                ...(reqHeaders?.authorization ? { Authorization: reqHeaders.authorization } : {}),
                ...(reqHeaders?.cookie ? { Cookie: reqHeaders.cookie } : {}),
            },
        })

        clientInstance = new ApolloClient({
            ssrMode: true,
            link: httpLink,
            cache: new InMemoryCache(),
        })
    }

    return clientInstance
}
