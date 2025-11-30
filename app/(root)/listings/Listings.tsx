'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import { ChevronLeft, ChevronRight, ListFilter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useMemo } from 'react'
import FilterDrawer from '@/components/drawers/FilterDrawer'
import { buildCategoryTree, FlatCategory } from '@/lib/utils'
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

    if (newFilters.categoryId)
      newParams.set('categoryId', newFilters.categoryId)
    if (newFilters.minPrice)
      newParams.set('minPrice', String(newFilters.minPrice))
    if (newFilters.maxPrice)
      newParams.set('maxPrice', String(newFilters.maxPrice))
    if (newFilters.condition) newParams.set('condition', newFilters.condition)
    if (newFilters.cityId) newParams.set('cityId', newFilters.cityId)
    if (newFilters.customCity)
      newParams.set('customCity', newFilters.customCity)
    if (newFilters.searchTerm)
      newParams.set('searchTerm', newFilters.searchTerm)
    if (newFilters.sortBy) newParams.set('sortBy', newFilters.sortBy)
    if (newFilters.sortOrder) newParams.set('sortOrder', newFilters.sortOrder)
    newParams.set('page', '1') // reset page

    router.push(`/listings?${newParams.toString()}`)
    setIsFilterOpen(false)
  }

  const clearAllFilters = () => {
    router.replace('/listings')
  }

  const hasActiveFilters = [...searchParams.entries()].some(([key, value]) => {
    return key !== 'page' && value !== undefined && value !== ''
  })

  return (
    <div className='w-full flex justify-center'>
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        categories={categoriesTree}
        currentFilters={Object.fromEntries(searchParams.entries())}
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

        {hasActiveFilters && (
          <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground flex-wrap'>
              <Search className='w-4 h-4' />
              <span>Filters applied</span>
              {/* Show active filter values */}
              {(() => {
                const params = Object.fromEntries(searchParams.entries())
                const filterLabels: string[] = []
                if (params.categoryId && categoriesData?.getCategories) {
                  const cat = categoriesData.getCategories.find(
                    (c) => c && c.id === params.categoryId
                  )
                  if (cat) filterLabels.push(`Category: ${cat.name}`)
                }
                if (params.minPrice || params.maxPrice) {
                  let priceLabel = 'Price:'
                  if (params.minPrice) priceLabel += ` from $${params.minPrice}`
                  if (params.maxPrice) priceLabel += ` to $${params.maxPrice}`
                  filterLabels.push(priceLabel)
                }
                if (params.condition)
                  filterLabels.push(`Condition: ${params.condition}`)
                if (params.customCity)
                  filterLabels.push(`City: ${params.customCity}`)
                else if (params.cityId)
                  filterLabels.push(`City ID: ${params.cityId}`)
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
