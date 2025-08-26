import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS } from '@/lib/graphql/queries'
import Listings from './Listings'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  const client = getServerApolloClient()
  const params = await searchParams
  const pageParam = params?.page
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1
  const limit = 100
  const offset = 0

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
