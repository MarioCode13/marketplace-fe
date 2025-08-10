import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS } from '@/lib/graphql/queries'
import Listings from './Listings'

interface PageProps {
  params: { [key: string]: string | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const client = getServerApolloClient()
  const pageParam = searchParams.page
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1
  // Fetch more items for client-side filtering
  const limit = 100 // Increased limit for client-side filtering
  const offset = 0 // Start from beginning since we're handling pagination client-side

  const { data } = await client.query({
    query: GET_LISTINGS,
    variables: {
      limit,
      offset,
    },
  })

  const listings = data?.getListings || { listings: [], totalCount: 0 }

  return (
    <Listings
      serverListings={listings}
      currentPage={page}
      itemsPerPage={8}
    />
  )
}
