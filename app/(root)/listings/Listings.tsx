'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import { ChevronLeft, ChevronRight, ListFilter, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useMemo, useCallback, useTransition } from 'react'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@/store/userContextSlice'
import {
  useAddToWatchlistMutation,
  useMyWatchlistListingIdsQuery,
  useRemoveFromWatchlistMutation,
} from '@/lib/graphql/generated'
import { toast } from 'sonner'
import FilterDrawer, {
  type FilterState,
} from '@/components/drawers/FilterDrawer'
import BrandFilterChips from '@/components/filters/BrandFilterChips'
import {
  buildCategoryTree,
  buildCategoryPath,
  FlatCategory,
  slugify,
} from '@/lib/utils'
import { useGetCategoriesQuery } from '@/lib/graphql/generated'
import { useQuery } from '@apollo/client'
import { BRANDS_BY_CATEGORY } from '@/lib/graphql/queries/brands'
import ListingsBoostCarousel from '@/components/carousel/ListingsBoostCarousel'
import { useListingsNavPending } from './listings-nav-context'

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

interface ListingsProps {
  serverListings: {
    listings: Listing[]
    totalCount: number
  }
  currentPage: number
  itemsPerPage: number
  /** Resolved category for brand filters (from path or query). */
  filterCategoryId?: string
  filterBrandId?: string
}

const Listings: React.FC<ListingsProps> = ({
  serverListings,
  currentPage,
  itemsPerPage,
  filterCategoryId,
  filterBrandId,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clickNavPending = useListingsNavPending()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isResultsLoading = clickNavPending || isPending
  const [wishlistPendingId, setWishlistPendingId] = useState<string | null>(
    null,
  )
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const { data: wishlistIdsData, refetch: refetchWishlistIds } =
    useMyWatchlistListingIdsQuery({
      skip: !isLoggedIn,
      fetchPolicy: 'cache-and-network',
    })
  const [addToWatchlist] = useAddToWatchlistMutation()
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation()
  const wishlistIdSet = useMemo(
    () => new Set(wishlistIdsData?.myWatchlistListingIds ?? []),
    [wishlistIdsData?.myWatchlistListingIds],
  )
  const { data: categoriesData } = useGetCategoriesQuery()

  const { data: brandsForFilter } = useQuery<{
    brandsByCategory: { id: string; name: string }[]
  }>(BRANDS_BY_CATEGORY, {
    variables: { categoryId: filterCategoryId! },
    skip: !filterCategoryId,
  })

  const activeBrandName = useMemo(() => {
    if (!filterBrandId) return undefined
    return brandsForFilter?.brandsByCategory.find((b) => b.id === filterBrandId)
      ?.name
  }, [filterBrandId, brandsForFilter])

  const handleWishlistToggle = useCallback(
    async (listingId: string) => {
      if (!isLoggedIn) {
        toast.info('Sign in to save listings to your wishlist')
        router.push('/login')
        return
      }
      const currentlyOn = wishlistIdSet.has(listingId)
      setWishlistPendingId(listingId)
      try {
        if (currentlyOn) {
          await removeFromWatchlist({ variables: { listingId } })
          toast.success('Removed from wishlist')
        } else {
          await addToWatchlist({ variables: { listingId } })
          toast.success('Saved to wishlist')
        }
        await refetchWishlistIds()
      } catch {
        toast.error('Could not update wishlist. Try again.')
      } finally {
        setWishlistPendingId(null)
      }
    },
    [
      addToWatchlist,
      isLoggedIn,
      refetchWishlistIds,
      removeFromWatchlist,
      router,
      wishlistIdSet,
    ],
  )

  const categoriesTree = useMemo(() => {
    if (!categoriesData?.getCategories) return []
    return buildCategoryTree(categoriesData.getCategories as FlatCategory[])
  }, [categoriesData])

  const totalPages = Math.ceil(serverListings.totalCount / itemsPerPage)
  const pathname = usePathname()

  const currentFiltersForDrawer = useMemo((): FilterState => {
    const raw = Object.fromEntries(searchParams.entries())
    const filters: FilterState = {
      categoryId: filterCategoryId || (raw.categoryId as string | undefined),
      brandId: filterBrandId || (raw.brandId as string | undefined),
      minPrice: raw.minPrice ? Number(raw.minPrice) : undefined,
      maxPrice: raw.maxPrice ? Number(raw.maxPrice) : undefined,
      condition: raw.condition as string | undefined,
      cityId: raw.cityId as string | undefined,
      customCity: (raw.customCity as string) || '',
      cityLabel: (raw.cityLabel as string) || '',
      searchTerm: (raw.searchTerm as string) || '',
      minDate: (raw.minDate as string) || '',
      maxDate: (raw.maxDate as string) || '',
      sortBy: (raw.sortBy as string) || 'createdAt',
      sortOrder: (raw.sortOrder as 'asc' | 'desc') || 'desc',
    }

    if (pathname && categoriesData?.getCategories) {
      const parts = pathname.split('/').filter(Boolean)
      if (parts[0] === 'listings' && parts[1]) {
        const allCats = categoriesData.getCategories as FlatCategory[]
        const idMap = new Map(allCats.map((c) => [c.id, c]))

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

        const slugMap: Record<string, string> = {}
        for (const cat of allCats) {
          const fullPath = getFullPath(cat.id)
          slugMap[fullPath.join('/')] = cat.id
          for (let k = fullPath.length - 1; k >= 1; k--) {
            const suffix = fullPath.slice(-k).join('/')
            if (!slugMap[suffix]) {
              slugMap[suffix] = cat.id
            }
          }
        }

        const seg = parts[1]
        const idx = seg.lastIndexOf('-in-')
        let categoryPath: string[] = []
        let cityLabel: string | undefined

        if (idx > 0) {
          categoryPath = [seg.slice(0, idx)]
          cityLabel = seg.slice(idx + 4)
        } else {
          categoryPath = parts.slice(1)
        }

        if (categoryPath.length > 0) {
          const pathKey = categoryPath.join('/')
          const resolvedId = slugMap[pathKey]
          if (resolvedId) {
            filters.categoryId = resolvedId
          }
        }

        if (cityLabel) {
          filters.cityLabel = cityLabel
        }
      }
    }

    return filters
  }, [
    searchParams,
    pathname,
    categoriesData,
    filterCategoryId,
    filterBrandId,
  ])

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href)
      })
    },
    [router],
  )

  const patchSearchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      })
      const qs = newParams.toString()
      const target =
        pathname && pathname.startsWith('/listings') ? pathname : '/listings'
      navigate(qs ? `${target}?${qs}` : target)
    },
    [searchParams, pathname, navigate],
  )

  const humanize = (slug?: string) =>
    slug
      ? slug
          .replace(/-/g, ' ')
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')
      : ''

  const handlePageChange = (newPage: number) => {
    patchSearchParams({ page: String(newPage) })
  }

  const handleApplyFilters = (newFilters: FilterState) => {
    const newParams = new URLSearchParams()
    const effectiveCategoryId =
      newFilters.categoryId || filterCategoryId || undefined

    let categoryPath: string[] | undefined
    if (effectiveCategoryId && categoriesData?.getCategories) {
      categoryPath = buildCategoryPath(
        effectiveCategoryId,
        categoriesData.getCategories as FlatCategory[],
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

        const targetId = effectiveCategoryId as string
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
      if (!categoryPath || categoryPath.length === 0) {
        newParams.set('categoryId', effectiveCategoryId)
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
    if (newFilters.brandId) newParams.set('brandId', newFilters.brandId)
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
    navigate(queryString ? `${basePath}?${queryString}` : basePath)
    setIsFilterOpen(false)
  }

  const clearAllFilters = () => {
    startTransition(() => {
      router.replace('/listings')
    })
  }

  // Consider a set of real filter keys (ignore sort/pagination)
  const handleBrandFilter = (brandId: string | undefined) => {
    patchSearchParams({ brandId, page: '1' })
  }

  const FILTER_KEYS = new Set([
    'categoryId',
    'brandId',
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
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        categories={categoriesTree}
        currentFilters={currentFiltersForDrawer}
      />

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

        {currentFiltersForDrawer.categoryId && (
          <div className='w-full mb-4'>
            <BrandFilterChips
              categoryId={currentFiltersForDrawer.categoryId}
              selectedBrandId={
                searchParams.get('brandId') || filterBrandId || undefined
              }
              onSelect={handleBrandFilter}
              disabled={isResultsLoading}
            />
          </div>
        )}

        {hasActiveFilters && (
          <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground flex-wrap'>
              <Search className='w-4 h-4' />
              <span>Filters applied</span>
              {/* Show active filter values */}
              {(() => {
                const params = Object.fromEntries(searchParams.entries())
                const filterLabels: string[] = []
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
                    categoriesData.getCategories.map((c) => [c?.id, c]),
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
                // only show category if explicitly filtered
                if (params.minPrice || params.maxPrice) {
                  let priceLabel = 'Price:'
                  if (params.minPrice) priceLabel += ` from $${params.minPrice}`
                  if (params.maxPrice) priceLabel += ` to $${params.maxPrice}`
                  filterLabels.push(priceLabel)
                }
                if (params.condition)
                  filterLabels.push(`Condition: ${params.condition}`)
                // Only show city if explicitly present in query/path. Not infer from listing data
                if (params.customCity) {
                  filterLabels.push(`City: ${params.customCity}`)
                } else if (pathCityLabel) {
                  filterLabels.push(`City: ${pathCityLabel}`)
                } else if (params.cityId) {
                  filterLabels.push(`City ID: ${params.cityId}`)
                }
                if (params.searchTerm)
                  filterLabels.push(`Search: "${params.searchTerm}"`)
                if (params.brandId && activeBrandName) {
                  filterLabels.push(`Brand: ${activeBrandName}`)
                }
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

        <div className='relative w-full min-h-[12rem]'>
          {isResultsLoading && (
            <div
              className='absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/75 backdrop-blur-[2px]'
              aria-live='polite'
              aria-busy='true'
            >
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
               
            </div>
          )}

          {(() => {
            const activeListings = serverListings.listings.filter(
              (listing) => !listing.sold,
            )
            return activeListings.length > 0 ? (
              <>
                <div className='w-full mb-4 text-sm text-muted-foreground'>
                  {`${activeListings.length} listing${
                    activeListings.length !== 1 ? 's' : ''
                  } found`}
                </div>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full pb-8 transition-opacity ${isResultsLoading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {activeListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={{
                        ...listing,
                        user: listing.user ?? undefined,
                      }}
                      showWishlistHeart
                      wishlisted={wishlistIdSet.has(listing.id)}
                      wishlistLoading={wishlistPendingId === listing.id}
                      onWishlistHeartClick={() =>
                        handleWishlistToggle(listing.id)
                      }
                    />
                  ))}
                </div>
              </>
            ) : (
              <div
                className={`text-center py-12 transition-opacity ${isResultsLoading ? 'opacity-50' : ''}`}
              >
                <p className='text-lg text-muted-foreground mb-2'>
                  No listings found
                </p>
                {hasActiveFilters && (
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={clearAllFilters}
                    className='mt-2'
                    disabled={isResultsLoading}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )
          })()}
        </div>

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
        <div className='py-6 mt-6 w-[100vw]'>
          <ListingsBoostCarousel />
        </div>
      </div>
    </div>
  )
}

export default Listings
