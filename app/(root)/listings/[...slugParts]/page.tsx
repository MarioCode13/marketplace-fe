import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTINGS, GET_CATEGORIES } from '@/lib/graphql/queries'
import Listings from '../Listings'
import ClientLoadingWrapper from '../loading-client'
import { Metadata } from 'next'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Browse Listings',
  description:
    'Browse thousands of secondhand items on Dealio. Find great deals on electronics, furniture, clothing, and more in South Africa.',
}

type SearchParams = { [key: string]: string | string[] | undefined }
type NextSearchParams = Promise<SearchParams> | undefined

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slugParts?: string[] }> | { slugParts?: string[] }
  searchParams?: NextSearchParams
}) {
  const resolvedParams = (await searchParams) || {}
  // Handle params as either Promise or direct object (Next.js 15 compatibility)
  const resolvedParams_obj = params instanceof Promise ? await params : params
  const client = getServerApolloClient()

  // Fetch categories early so we can use them to resolve category slugs
  let allCategories: Array<{
    id: string
    name: string
    parentId?: string | null
  }> = []
  try {
    const { data } = await client.query({
      query: GET_CATEGORIES,
      fetchPolicy: 'network-only',
    })
    allCategories = data?.getCategories || []
  } catch (err) {
    console.error('Error fetching categories for slug resolution:', err)
  }

  // Build a map for efficient category lookup by full slug path.
  // Uses shared `slugify` so slugs are computed consistently with the rest of the app.
  // Only expose suffix mappings that are unique to avoid ambiguous matches (avoid picking an arbitrary category).
  const buildSlugMap = () => {
    const idMap = new Map(allCategories.map((c) => [c.id, c]))
    const slugMap: Record<string, string> = {} // Maps slug or path to category ID

    const getFullPath = (id: string): string[] => {
      const parts: string[] = []
      let cur = idMap.get(id)
      while (cur) {
        // Always use slugify(name), never use stored slug (which may be a full path)
        parts.unshift(slugify(cur.name))
        if (!cur.parentId) break
        cur = idMap.get(cur.parentId as string)
      }
      return parts
    }

    // First pass: collect all suffix -> ids lists
    const suffixMap = new Map<string, string[]>()
    for (const cat of allCategories) {
      const fullPath = getFullPath(cat.id)
      // always register the full path mapping
      slugMap[fullPath.join('/')] = cat.id

      // collect suffixes
      for (let k = 1; k <= fullPath.length; k++) {
        const suffix = fullPath.slice(-k).join('/')
        const existing = suffixMap.get(suffix) || []
        existing.push(cat.id)
        suffixMap.set(suffix, existing)
      }
    }

    // Second pass: only add suffix mappings that are unique
    for (const [suf, ids] of suffixMap.entries()) {
      if (ids.length === 1) {
        slugMap[suf] = ids[0]
      }
    }

    return slugMap
  }

  const slugToIdMap = buildSlugMap()

  const getParamValue = (key: string): string | undefined => {
    const value = resolvedParams[key]
    return value ? (Array.isArray(value) ? value[0] : value) : undefined
  }

  // Path segments can be:
  // - /listings/[categorySlug] (1 segment: top-level category)
  // - /listings/[parentSlug]/[childSlug] (2 segments: parent/child category)
  // - /listings/[citySlug]/[categorySlug] (2 segments: city + category)
  // - /listings/[citySlug]/[parentSlug]/[childSlug] (3 segments: city + parent/child)
  const slugParts = resolvedParams_obj?.slugParts || []

  // First, try to fetch categories to resolve category paths

  // Helper to resolve a category path (e.g., ["electronics", "computers-tablets"]) to a category ID
  // This resolver matches categories by suffix: it builds full slug paths for every
  // category and returns the category whose full path ends with the provided pathSegments.
  // If multiple matches exist, prefer the shallower (shorter full path) match.

  // Determine city slug and category path
  // Strategy: If first segment matches a city slug, it's a city; otherwise it's part of category path
  // For now, we'll assume: 1 segment = category, 2 segments = could be city+category or parent+child
  // 3+ segments = city + category path
  let citySlug: string | undefined
  let categoryPath: string[] = []

  if (slugParts.length === 1) {
    // Single segment: could be a category OR a combined "{category}-in-{city}" slug
    const part = slugParts[0]
    const idx = part.lastIndexOf('-in-')
    if (idx > 0) {
      // split into categorySlug and citySlug
      const catPart = part.slice(0, idx)
      const cityPart = part.slice(idx + 4)
      categoryPath = [catPart]
      citySlug = cityPart
    } else {
      categoryPath = slugParts
    }
  } else if (slugParts.length === 2) {
    // Two segments: could be city+category OR parent+child category
    // We'll try to resolve as category path first (parent/child)
    // If that fails, we can try city+category
    // For now, let's assume it's parent/child category path
    // Two segments: could be parent/child category OR parent + combined(last segment contains -in-)
    // If the last segment contains "-in-" treat it as category-in-city for the last segment.
    const last = slugParts[1]
    const idx = last.lastIndexOf('-in-')
    if (idx > 0) {
      const lastCat = last.slice(0, idx)
      const cityPart = last.slice(idx + 4)
      categoryPath = [slugParts[0], lastCat]
      citySlug = cityPart
    } else {
      categoryPath = slugParts
    }
    // TODO: Could add logic here to check if first segment is a city
  } else if (slugParts.length >= 3) {
    // Three+ segments: first is city, rest is category path
    citySlug = slugParts[0]
    categoryPath = slugParts.slice(1)
  }

  // For single-segment paths, we need to differentiate between category and city slugs
  // Strategy: Try to match against known categories first; if no match, treat as city slug
  let categorySlug = categoryPath.length === 1 ? categoryPath[0] : undefined
  let resolvedCategoryId: string | undefined = undefined

  // Try to resolve category path to category ID
  if (categoryPath.length > 0) {
    const pathKey = categoryPath.join('/')
    const idFromMap = slugToIdMap[pathKey]

    if (idFromMap) {
      resolvedCategoryId = idFromMap
      categorySlug = undefined // Use resolved ID instead
    }
  }

  // If single segment, check if it's a known category; if not, treat as city
  if (categoryPath.length === 1 && categorySlug && !slugToIdMap[categorySlug]) {
    citySlug = categorySlug
    categoryPath = []
    categorySlug = undefined
    resolvedCategoryId = undefined
  }

  const pageParam = getParamValue('page')
  const page = Number(pageParam) || 1
  const limit = 12
  const offset = (page - 1) * limit

  // Only use categoryId from query params if we don't have a categorySlug from the path
  const categoryId =
    !categorySlug && !resolvedCategoryId
      ? getParamValue('categoryId') || undefined
      : resolvedCategoryId || undefined
  const minPrice = getParamValue('minPrice')
  const maxPrice = getParamValue('maxPrice')
  const condition = getParamValue('condition')
  const searchTerm = getParamValue('searchTerm')
  const minDate = getParamValue('minDate')
  const maxDate = getParamValue('maxDate')
  // Only use cityId from query params if we don't have a citySlug from the path
  const cityId = !citySlug ? getParamValue('cityId') || undefined : undefined
  const sortBy = getParamValue('sortBy')
  const sortOrder = getParamValue('sortOrder')

  // Build variables object, explicitly excluding undefined/null values
  const variables: Record<string, string | number | undefined> = {
    limit,
    offset,
  }

  // Prefer categoryId (resolved from path or query params); only use categorySlug as fallback
  if (categoryId) {
    variables.categoryId = categoryId
  } else if (categorySlug) {
    variables.categorySlug = categorySlug
  }

  // Only include cityId OR citySlug, never both
  if (citySlug) {
    variables.citySlug = citySlug
    delete variables.cityId
  } else if (cityId) {
    variables.cityId = cityId
    delete variables.citySlug
  }
  // If neither is provided, don't include either field

  // Add optional filters only if they have values
  if (minPrice) variables.minPrice = parseFloat(minPrice)
  if (maxPrice) variables.maxPrice = parseFloat(maxPrice)
  if (condition) variables.condition = condition
  if (searchTerm) variables.searchTerm = searchTerm
  if (minDate) variables.minDate = minDate
  if (maxDate) variables.maxDate = maxDate
  if (sortBy) variables.sortBy = sortBy
  if (sortOrder) variables.sortOrder = sortOrder

  // Debug: log variables to see what we're sending
  console.log('Slug parts:', slugParts)
  console.log('Category path:', categoryPath)
  console.log('GraphQL variables:', JSON.stringify(variables, null, 2))

  try {
    const { data, error } = await client.query({
      query: GET_LISTINGS,
      variables,
      fetchPolicy: 'network-only',
    })

    if (error) {
      console.error('GraphQL error:', error)
    }

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
  } catch (error) {
    console.error('Error fetching listings:', error)
    return (
      <ClientLoadingWrapper>
        <Listings
          serverListings={{ listings: [], totalCount: 0 }}
          currentPage={page}
          itemsPerPage={limit}
        />
      </ClientLoadingWrapper>
    )
  }
}
