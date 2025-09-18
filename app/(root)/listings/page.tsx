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
type NextSearchParams = Promise<SearchParams> | undefined

export default async function Page({
  searchParams,
}: {
  searchParams?: NextSearchParams
}) {
  // Ensure searchParams is resolved and defaulted to empty object if undefined
  const resolvedParams = (await searchParams) || {}
  const client = getServerApolloClient()

  // Helper function to safely get a single value from search params
  const getParamValue = (key: string): string | undefined => {
    const value = resolvedParams[key]
    return value ? (Array.isArray(value) ? value[0] : value) : undefined
  }

  // Extract page safely
  const pageParam = getParamValue('page')
  const page = Number(pageParam) || 1
  const limit = 12
  const offset = (page - 1) * limit

  // Extract filters from URL params
  const categoryId = getParamValue('categoryId') || undefined
  const minPrice = getParamValue('minPrice')
  const maxPrice = getParamValue('maxPrice')
  const condition = getParamValue('condition')
  const searchTerm = getParamValue('searchTerm')
  const cityId = getParamValue('cityId') || undefined
  const sortBy = getParamValue('sortBy')
  const sortOrder = getParamValue('sortOrder')

  const variables = {
    limit,
    offset,
    categoryId,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    condition,
    searchTerm,
    cityId,
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
