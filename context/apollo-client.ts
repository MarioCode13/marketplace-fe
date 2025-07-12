import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}/graphql`,
})


const authLink = setContext((_, { headers }) => {
    let token = null
    if (typeof window !== 'undefined') {
        token = localStorage.getItem("token")
    }
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

export default client
