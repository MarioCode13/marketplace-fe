import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS } from '@/lib/graphql/queries'
import Listings from './Listings'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const client = getServerApolloClient()
  const page = Number(searchParams.page) || 1
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
