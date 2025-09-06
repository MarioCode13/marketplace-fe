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

interface PageProps {
  searchParams: SearchParams | Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  // Ensure searchParams is resolved
  const resolvedParams = await searchParams
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
  const categoryId = getParamValue('categoryId')
  const minPrice = getParamValue('minPrice')
  const maxPrice = getParamValue('maxPrice')
  const condition = getParamValue('condition')
  const searchTerm = getParamValue('searchTerm')
  const cityId = getParamValue('cityId')
  const sortBy = getParamValue('sortBy')
  const sortOrder = getParamValue('sortOrder')

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
