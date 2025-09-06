import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS } from '@/lib/graphql/queries'
import Listings from './Listings'
import ClientLoadingWrapper from './loading-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
// Disable static data caching
export const fetchCache = 'force-no-store'
export const revalidate = 0

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const client = getServerApolloClient()

  // Helper function to safely get a single value from search params
  const getParamValue = async (key: string) => {
    const value = searchParams[key]
    return value ? (Array.isArray(value) ? value[0] : value) : undefined
  }

  // Extract page safely
  const pageParam = await getParamValue('page')
  const page = Number(pageParam) || 1
  const limit = 12
  const offset = (page - 1) * limit

  // Extract filters from URL params
  const [
    categoryId,
    minPrice,
    maxPrice,
    condition,
    searchTerm,
    cityId,
    sortBy,
    sortOrder,
  ] = await Promise.all([
    getParamValue('categoryId'),
    getParamValue('minPrice'),
    getParamValue('maxPrice'),
    getParamValue('condition'),
    getParamValue('searchTerm'),
    getParamValue('cityId'),
    getParamValue('sortBy'),
    getParamValue('sortOrder'),
  ])

  // Build variables object
  const variables = {
    limit,
    offset,
    categoryId: categoryId ? Number(categoryId) : undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    condition,
    searchTerm,
    cityId: cityId ? Number(cityId) : undefined,
    sortBy,
    sortOrder,
  }

  // Fetch from GraphQL with network-only to ensure fresh data
  const { data } = await client.query({
    query: GET_LISTINGS,
    variables,
    fetchPolicy: 'network-only',
  })

  const listings = data?.getListings || { listings: [], totalCount: 0 }

  return (
    <ClientLoadingWrapper>
      <Listings
        serverListings={listings}
        currentPage={page}
        itemsPerPage={limit}
      />
    </ClientLoadingWrapper>
  )
}
