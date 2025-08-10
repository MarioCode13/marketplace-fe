'use client'

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { useMemo } from 'react'
import { setContext } from '@apollo/client/link/context'
import { getCookie } from '@/lib/auth/auth'

let apolloClient: ApolloClient<unknown> | null = null

export function getApolloClient(initialState = {}) {
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }

  if (!apolloClient) {
    apolloClient = createApolloClient(initialState)
  }

  return apolloClient
}

function createApolloClient(initialState = {}) {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`,
    fetch,
  })

  const authLink = setContext(async (_, { headers }) => {
    const csrfToken = getCookie('csrf-token')

    // The auth token will be automatically included in requests via httpOnly cookie
    return {
      headers: {
        ...headers,
        'X-CSRF-Token': csrfToken || '',
      },
      credentials: 'include', // Important for cookies
    }
  })

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  // Initialize with provided state
  if (initialState) {
    client.cache.restore(initialState)
  }

  return client
}

export default function ApolloProviderWrapper({
  children,
  initialState = {},
}: {
  children: React.ReactNode
  initialState?: Record<string, unknown>
}) {
  const client = useMemo(() => {
    // On the client side, reuse the client instance
    if (typeof window !== 'undefined' && apolloClient) {
      return apolloClient
    }

    // Create new client instance
    apolloClient = createApolloClient(initialState)
    return apolloClient
  }, [initialState])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
