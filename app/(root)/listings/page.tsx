import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS } from '@/lib/graphql/queries'
import Listings from './Listings'

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const client = getServerApolloClient()
  const pageParam = searchParams?.page
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
