import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS } from '@/lib/graphql/queries'
import Listings from './Listings'
import ClientLoadingWrapper from './loading-client'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Browse Listings',
  description:
    'Browse thousands of secondhand items on Dealio. Find great deals on electronics, furniture, clothing, and more in South Africa.',
  openGraph: {
    title: 'Browse Listings | Dealio',
    description:
      'Browse thousands of secondhand items on Dealio. Find great deals in South Africa.',
    url: 'https://dealio.org.za/listings',
  },
  alternates: {
    canonical: '/listings',
  },
}

type SearchParams = { [key: string]: string | string[] | undefined }
type NextSearchParams = Promise<SearchParams> | undefined

export default async function Page({
  searchParams,
}: {
  searchParams?: NextSearchParams
}) {
  const resolvedParams = (await searchParams) || {}
  const client = getServerApolloClient()

  const getParamValue = (key: string): string | undefined => {
    const value = resolvedParams[key]
    return value ? (Array.isArray(value) ? value[0] : value) : undefined
  }

  // Extract page
  const pageParam = getParamValue('page')
  const page = Number(pageParam) || 1
  const limit = 12
  const offset = (page - 1) * limit

  // Extract filters from params
  const categoryId = getParamValue('categoryId') || undefined
  const minPrice = getParamValue('minPrice')
  const maxPrice = getParamValue('maxPrice')
  const condition = getParamValue('condition')
  const searchTerm = getParamValue('searchTerm')
  const minDate = getParamValue('minDate')
  const maxDate = getParamValue('maxDate')
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
    minDate,
    maxDate,
    cityId,
    sortBy,
    sortOrder,
  }

  // Debug: log date conversion
  process.stderr.write(
    `\n[DEBUG SSR /listings] minDate param: ${minDate} → converted: ${variables.minDate}\n`,
  )
  process.stderr.write(
    `[DEBUG SSR /listings] maxDate param: ${maxDate} → converted: ${variables.maxDate}\n`,
  )
  process.stderr.write(
    `[DEBUG SSR /listings] GraphQL variables: ${JSON.stringify(
      variables,
      null,
      2,
    )}\n`,
  )

  // Ensure fresh data
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
