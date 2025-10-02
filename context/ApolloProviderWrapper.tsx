'use client'

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { useMemo } from 'react'
import { setContext } from '@apollo/client/link/context'

function createApolloClient(initialState = {}) {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`,
    fetch,
  })

  // No longer set Authorization header from localStorage token
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
      },
      credentials: 'include', // Ensure cookies are sent
    }
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
  })
}

export default function ApolloProviderWrapper({
  children,
  initialState = {},
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any // for server-side rendering support
}) {
  const client = useMemo(() => createApolloClient(initialState), [initialState])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
