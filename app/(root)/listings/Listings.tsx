'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import { ChevronLeft, ChevronRight, ListFilter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useMemo } from 'react'
import FilterDrawer from '@/components/drawers/FilterDrawer'
import {
  buildCategoryTree,
  buildCategoryPath,
  FlatCategory,
  slugify,
} from '@/lib/utils'
import { useGetCategoriesQuery } from '@/lib/graphql/generated'

interface Listing {
  id: string
  title: string
  description: string
  price: string
  images: string[]
  createdAt: string
  sold?: boolean
  category: {
    id: string
    name: string
  }
  condition: string
  city?: {
    id: string
    name: string
    region: {
      name: string
      country: {
        name: string
      }
    }
  }
  customCity?: string
  user: {
    id: string
    username: string
  }
}

interface Filters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  searchTerm?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  cityId?: string
  cityLabel?: string
  customCity?: string
}

interface ListingsProps {
  serverListings: {
    listings: Listing[]
    totalCount: number
  }
  currentPage: number
  itemsPerPage: number
}

const Listings: React.FC<ListingsProps> = ({
  serverListings,
  currentPage,
  itemsPerPage,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { data: categoriesData } = useGetCategoriesQuery()

  const categoriesTree = useMemo(() => {
    if (!categoriesData?.getCategories) return []
    return buildCategoryTree(categoriesData.getCategories as FlatCategory[])
  }, [categoriesData])

  const totalPages = Math.ceil(serverListings.totalCount / itemsPerPage)
  const pathname = usePathname()

  const humanize = (slug?: string) =>
    slug
      ? slug
          .replace(/-/g, ' ')
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')
      : ''

  const updateQuery = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    router.push(`/listings?${newParams.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: String(newPage) })
  }

  const handleApplyFilters = (newFilters: Filters) => {
    const newParams = new URLSearchParams()

    let categoryPath: string[] | undefined
    if (newFilters.categoryId && categoriesData?.getCategories) {
      // Build full category path (parent/child)
      categoryPath = buildCategoryPath(
        newFilters.categoryId,
        categoriesData.getCategories as FlatCategory[]
      )

      // Reduce to minimal unique path: prefer leaf-only slug unless ambiguous
      const allCats = categoriesData.getCategories as FlatCategory[]
      if (categoryPath && categoryPath.length > 0) {
        // Build full slug path for every category
        const idMap = new Map(allCats.map((c) => [c.id, c]))
        const fullPaths: Record<string, string[]> = {}
        const getFullPath = (id: string): string[] => {
          if (fullPaths[id]) return fullPaths[id]
          const parts: string[] = []
          let cur: FlatCategory | undefined | null = idMap.get(id)
          while (cur) {
            // Use generated slug from the category name to avoid stored composite slugs
            const s = slugify(cur.name)
            parts.unshift(s)
            if (!cur.parentId) break
            cur = idMap.get(cur.parentId as string)
          }
          fullPaths[id] = parts
          return parts
        }

        const targetId = newFilters.categoryId as string
        const targetFull = getFullPath(targetId)
        // Try shortest suffixes (leaf only, parent/leaf, ...) until unique
        let minimal: string[] | undefined
        for (let k = 1; k <= targetFull.length; k++) {
          const candidate = targetFull.slice(-k)
          let matchCount = 0
          for (const c of allCats) {
            const p = getFullPath(c.id)
            const tail = p.slice(-k)
            if (
              tail.length === candidate.length &&
              tail.every((v, i) => v === candidate[i])
            ) {
              matchCount++
              if (matchCount > 1) break
            }
          }
          if (matchCount === 1) {
            minimal = candidate
            break
          }
        }
        if (minimal) categoryPath = minimal
      }

      // If we couldn't build a path, fall back to categoryId in query params
      if (categoryPath.length === 0) {
        newParams.set('categoryId', newFilters.categoryId)
        categoryPath = undefined
      }
    }

    if (newFilters.minPrice)
      newParams.set('minPrice', String(newFilters.minPrice))
    if (newFilters.maxPrice)
      newParams.set('maxPrice', String(newFilters.maxPrice))
    if (newFilters.condition) newParams.set('condition', newFilters.condition)
    // do not include internal cityId or cityLabel in the URL for cleanliness; rely on path slugs
    if (newFilters.customCity)
      newParams.set('customCity', newFilters.customCity)
    if (newFilters.searchTerm)
      newParams.set('searchTerm', newFilters.searchTerm)
    if (newFilters.minDate) newParams.set('minDate', newFilters.minDate)
    if (newFilters.maxDate) newParams.set('maxDate', newFilters.maxDate)
    if (newFilters.sortBy) newParams.set('sortBy', newFilters.sortBy)
    if (newFilters.sortOrder) newParams.set('sortOrder', newFilters.sortOrder)
    newParams.set('page', '1') // reset page

    // Build path: prefer SEO-friendly single-segment like '/listings/{leafCategory}-in-{city}'
    let basePath = '/listings'
    if (categoryPath && categoryPath.length > 0 && newFilters.cityLabel) {
      // use minimal category path (leaf or parent/leaf) computed above
      const leaf = categoryPath[categoryPath.length - 1]
      const citySlug = slugify(newFilters.cityLabel)
      basePath = `/listings/${leaf}-in-${citySlug}`
    } else if (categoryPath && categoryPath.length > 0) {
      // fallback to minimal category path joined by '/'
      basePath = `/listings/${categoryPath.join('/')}`
    } else if (newFilters.cityLabel) {
      // city-only URL: /listings/{city}
      const citySlug = slugify(newFilters.cityLabel)
      basePath = `/listings/${citySlug}`
    }

    const queryString = newParams.toString()
    router.push(queryString ? `${basePath}?${queryString}` : basePath)
    setIsFilterOpen(false)
  }

  const clearAllFilters = () => {
    router.replace('/listings')
  }

  // Consider a set of real filter keys (ignore sort/pagination)
  const FILTER_KEYS = new Set([
    'categoryId',
    'minPrice',
    'maxPrice',
    'condition',
    'searchTerm',
    'cityId',
    'customCity',
    'minDate',
    'maxDate',
  ])

  const hasQueryFilters = [...searchParams.entries()].some(([key, value]) => {
    return FILTER_KEYS.has(key) && value !== undefined && value !== ''
  })

  const pathHasFilter = !!(
    pathname && pathname.split('/').filter(Boolean).length > 1
  )

  const hasActiveFilters = hasQueryFilters || pathHasFilter

  return (
    <div className='w-full flex justify-center'>
      {(() => {
        // Build currentFilters for the drawer: start from query params
        const raw = Object.fromEntries(searchParams.entries()) as Record<
          string,
          any
        >
        const currentFiltersForDrawer: Record<string, any> = { ...raw }

        // Try to derive categoryId / cityLabel from the pathname when the path encodes them
        if (pathname && categoriesData?.getCategories) {
          const parts = pathname.split('/').filter(Boolean)
          if (parts[0] === 'listings' && parts[1]) {
            const allCats = categoriesData.getCategories as FlatCategory[]
            const idMap = new Map(allCats.map((c) => [c.id, c]))

            // Build slug-to-ID map for this category tree
            const getFullPath = (id: string): string[] => {
              const p: string[] = []
              let cur = idMap.get(id)
              while (cur) {
                p.unshift(cur.name.toLowerCase().replace(/\s+/g, '-'))
                if (!cur.parentId) break
                cur = idMap.get(cur.parentId as string)
              }
              return p
            }

            // Map all full category paths to their IDs
            const slugMap: Record<string, string> = {}
            for (const cat of allCats) {
              const fullPath = getFullPath(cat.id)
              slugMap[fullPath.join('/')] = cat.id
              // Also add suffixes for partial matching
              for (let k = fullPath.length - 1; k >= 1; k--) {
                const suffix = fullPath.slice(-k).join('/')
                if (!slugMap[suffix]) {
                  slugMap[suffix] = cat.id
                }
              }
            }

            // Extract category and city from path
            const seg = parts[1]
            const idx = seg.lastIndexOf('-in-')
            let categoryPath: string[] = []
            let cityLabel: string | undefined

            if (idx > 0) {
              // Format: category-in-city
              categoryPath = [seg.slice(0, idx)]
              cityLabel = seg.slice(idx + 4)
            } else {
              // Could be category path like parent/child or just single category
              categoryPath = parts.slice(1)
            }

            // Try to resolve category path to ID only if there's actually a category in the path
            if (categoryPath.length > 0) {
              const pathKey = categoryPath.join('/')
              const resolvedId = slugMap[pathKey]
              if (resolvedId) {
                currentFiltersForDrawer.categoryId = resolvedId
              }
            }
            // Don't set categoryId from anywhere else - it must come from explicit path segments

            if (cityLabel) {
              currentFiltersForDrawer.cityLabel = cityLabel
            }
          }
        }

        return (
          <FilterDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={handleApplyFilters}
            categories={categoriesTree}
            currentFilters={currentFiltersForDrawer}
          />
        )
      })()}

      <div className='flex flex-col items-center p-6 w-full max-w-7xl'>
        <div className='flex items-center justify-between w-full mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              aria-label='Open filters'
              onClick={() => setIsFilterOpen(true)}
              variant='outlined'
              color='primary'
              size='icon'
              className='rounded-full p-3'
            >
              <ListFilter
                className='!w-5 !h-5'
                strokeWidth={2}
              />
            </Button>
          </div>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>Available Listings</h1>
          </div>
          <div className='w-12'></div>
        </div>

        {hasActiveFilters && (
          <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground flex-wrap'>
              <Search className='w-4 h-4' />
              <span>Filters applied</span>
              {/* Show active filter values */}
              {(() => {
                const params = Object.fromEntries(searchParams.entries())
                const filterLabels: string[] = []
                const firstListing = serverListings.listings[0]
                // try to extract category/city from path if available
                let pathCategoryLabel: string | undefined
                let pathCityLabel: string | undefined
                if (pathname) {
                  const parts = pathname.split('/').filter(Boolean)
                  if (parts[0] === 'listings' && parts[1]) {
                    const seg = parts[1]
                    const idx = seg.lastIndexOf('-in-')
                    if (idx > 0) {
                      pathCategoryLabel = humanize(seg.slice(0, idx))
                      pathCityLabel = humanize(seg.slice(idx + 4))
                    } else {
                      // could be full category path like /listings/electronics/phones
                      // or city-only /listings/johannesburg
                      const rest = parts.slice(1)
                      if (rest.length >= 1) {
                        // join all segments as a breadcrumb-like label
                        pathCategoryLabel = rest
                          .map((r) => humanize(r))
                          .join(' / ')
                      }
                    }
                  }
                }
                if (params.categoryId && categoriesData?.getCategories) {
                  // Build full category name chain from categoryId using categories data
                  const id = params.categoryId as string
                  const catMap = new Map(
                    categoriesData.getCategories.map((c) => [c?.id, c])
                  )
                  const names: string[] = []
                  let cur = catMap.get(id)
                  while (cur) {
                    names.unshift(cur.name)
                    if (!cur.parentId) break
                    cur = catMap.get(cur.parentId)
                  }
                  if (names.length > 0)
                    filterLabels.push(`Category: ${names.join(' / ')}`)
                } else if (pathCategoryLabel) {
                  // Prefer category coming from the path (explicit URL)
                  filterLabels.push(`Category: ${pathCategoryLabel}`)
                }
                // NEVER infer category from the first listing - only show if explicitly filtered
                if (params.minPrice || params.maxPrice) {
                  let priceLabel = 'Price:'
                  if (params.minPrice) priceLabel += ` from $${params.minPrice}`
                  if (params.maxPrice) priceLabel += ` to $${params.maxPrice}`
                  filterLabels.push(priceLabel)
                }
                if (params.condition)
                  filterLabels.push(`Condition: ${params.condition}`)
                // Only show city if explicitly present in query/path. Do NOT infer from listing data.
                if (params.customCity) {
                  filterLabels.push(`City: ${params.customCity}`)
                } else if (pathCityLabel) {
                  filterLabels.push(`City: ${pathCityLabel}`)
                } else if (params.cityId) {
                  filterLabels.push(`City ID: ${params.cityId}`)
                }
                if (params.searchTerm)
                  filterLabels.push(`Search: "${params.searchTerm}"`)
                if (params.sortBy)
                  filterLabels.push(`Sort by: ${params.sortBy}`)
                if (params.sortOrder)
                  filterLabels.push(`Order: ${params.sortOrder}`)
                return filterLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className='ml-2 px-2 py-1 rounded bg-componentBackground  '
                  >
                    {label}
                  </span>
                ))
              })()}
            </div>
            <Button
              color='secondary'
              variant='contained'
              size='sm'
              onClick={clearAllFilters}
              className='text-sm mt-4'
              data-filter-action='clear'
            >
              Clear Filters
            </Button>
          </div>
        )}

        {(() => {
          const activeListings = serverListings.listings.filter(
            (listing) => !listing.sold
          )
          return activeListings.length > 0 ? (
            <>
              <div className='w-full mb-4 text-sm text-muted-foreground'>
                {`${activeListings.length} listing${
                  activeListings.length !== 1 ? 's' : ''
                } found`}
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full pb-8'>
                {activeListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={{
                      ...listing,
                      user: listing.user ?? undefined,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className='text-center py-12'>
              <p className='text-lg text-muted-foreground mb-2'>
                No listings found
              </p>
              {hasActiveFilters && (
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={clearAllFilters}
                  className='mt-2'
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )
        })()}

        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-4 mt-8'>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size='icon'
              variant='outlined'
              color='primary'
              className='rounded-full disabled:opacity-50'
              data-pagination='prev'
            >
              <ChevronLeft />
            </Button>

            <span className='text-sm text-muted-foreground'>
              {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              size='icon'
              variant='outlined'
              color='primary'
              className='rounded-full disabled:opacity-50'
              data-pagination='next'
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Listings
