'use client'

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { useMemo } from 'react'
import { setContext } from '@apollo/client/link/context'

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
    // Ensure cookies (like jwt) are sent with every request
    // Apollo forwards this to fetch as the credentials option
    credentials: 'include',
  })

  // Add CSRF token to requests (auth via httpOnly cookie + credentials)
  const authLink = setContext((_, { headers }) => {
    // Get cookies
    function getCookie(name: string): string | undefined {
      if (typeof window === 'undefined') return undefined
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        const part = parts.pop()
        if (part) return part.split(';').shift()
      }
      return undefined
    }

    const xsrfToken = getCookie('XSRF-TOKEN')
    
    return {
      headers: {
        ...headers,
        ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken }),
      },
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
