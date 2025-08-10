'use client'

import { useRouter } from 'next/navigation'
import ListingCard from '@/components/cards/ListingCard'
import { ChevronLeft, ChevronRight, ListFilter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useMemo } from 'react'
import FilterDrawer from '@/components/drawers/FilterDrawer'
import { buildCategoryTree, FlatCategory, CategoryNode } from '@/lib/utils'
import { useGetCategoriesQuery } from '@/lib/graphql/generated'

interface Listing {
  id: string
  title: string
  description: string
  price: string
  images: string[]
  createdAt: string
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
    trustRating?: {
      overallScore: number
      starRating: number
      trustLevel: string
      totalReviews: number
      positiveReviews: number
    }
  }
}

interface Filters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  location?: string
  searchTerm?: string
  minDate?: string
  maxDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  cityId?: string
  cityName?: string
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})
  const { data: categoriesData } = useGetCategoriesQuery()

  const categoriesTree = useMemo(() => {
    if (!categoriesData?.getCategories) return []
    return buildCategoryTree(categoriesData.getCategories as FlatCategory[])
  }, [categoriesData])

  // Process server data and apply client-side filters
  const { filteredListings, filteredCount } = useMemo(() => {
    let filtered = [...serverListings.listings]

    // Apply category filter with hierarchy support
    if (filters.categoryId) {
      // Find all parent categories leading to the selected category
      const findParentCategories = (
        targetId: string,
        categories: CategoryNode[],
        path: string[] = []
      ): string[] | null => {
        for (const cat of categories) {
          if (cat.id === targetId) {
            return [...path, cat.id]
          }
          if (cat.children) {
            const childPath = findParentCategories(targetId, cat.children, [
              ...path,
              cat.id,
            ])
            if (childPath) {
              return childPath
            }
          }
        }
        return null
      }

      // Find all child categories under a given category
      const findChildCategories = (
        categoryId: string,
        categories: CategoryNode[]
      ): string[] => {
        const result: string[] = []
        const category = categories.find((c) => c.id === categoryId)

        if (category) {
          result.push(category.id)
          if (category.children) {
            category.children.forEach((child) => {
              result.push(...findChildCategories(child.id, [child]))
            })
          }
        }

        return result
      }

      // Get both parent and child category IDs
      const parentPath = findParentCategories(
        filters.categoryId,
        categoriesTree
      ) || [filters.categoryId]
      const allCategoryIds = new Set<string>()

      // Add all parent categories to the set
      parentPath.forEach((id) => allCategoryIds.add(id))

      // Add all child categories to the set
      const category = categoriesTree.find((c) => c.id === filters.categoryId)
      if (category) {
        findChildCategories(category.id, [category]).forEach((id) =>
          allCategoryIds.add(id)
        )
      }

      // Filter listings by both parent and child categories
      filtered = filtered.filter(
        (item) => item.category && allCategoryIds.has(item.category.id)
      )
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(
        (item) => parseFloat(item.price) >= filters.minPrice!
      )
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (item) => parseFloat(item.price) <= filters.maxPrice!
      )
    }

    // Apply condition filter
    if (filters.condition) {
      filtered = filtered.filter((item) => item.condition === filters.condition)
    }

    // Apply location filters
    if (filters.cityId) {
      filtered = filtered.filter((item) => item.city?.id === filters.cityId)
    }
    if (filters.customCity) {
      filtered = filtered.filter((item) =>
        item.customCity
          ?.toLowerCase()
          .includes(filters.customCity!.toLowerCase())
      )
    }

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortField = filters.sortBy
      const sortOrder = filters.sortOrder || 'desc'

      filtered.sort((a, b) => {
        let valueA, valueB

        switch (sortField) {
          case 'price':
            valueA = parseFloat(a.price)
            valueB = parseFloat(b.price)
            break
          case 'createdAt':
            valueA = new Date(a.createdAt).getTime()
            valueB = new Date(b.createdAt).getTime()
            break
          case 'title':
            valueA = a.title.toLowerCase()
            valueB = b.title.toLowerCase()
            break
          default:
            return 0
        }

        if (sortOrder === 'asc') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
        } else {
          return valueB < valueA ? -1 : valueB > valueA ? 1 : 0
        }
      })
    }

    return {
      filteredListings: filtered,
      filteredCount: filtered.length,
    }
  }, [serverListings.listings, filters, categoriesTree])

  const totalPages = Math.ceil(filteredCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedListings = filteredListings.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Handle pagination separately from filters
  const handlePageChange = (newPage: number) => {
    // For now, just update the URL. Later we'll add filters to URL params too
    router.push(`/listings?page=${newPage}`, { scroll: false })
  }

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters)
    // Reset to first page when filters change
    if (currentPage !== 1) {
      handlePageChange(1)
    }
  }

  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (value) =>
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
    )
  }

  const clearAllFilters = () => {
    setFilters({})
  }

  return (
    <div className='w-full flex justify-center'>
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        categories={categoriesTree}
        currentFilters={filters}
      />{' '}
      <div className='flex flex-col items-center p-6 w-full max-w-7xl'>
        <div className='flex items-center justify-between w-full mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              aria-label='Open filters'
              onClick={() => setIsFilterOpen(true)}
              variant={'outline'}
              size={'icon'}
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

        {hasActiveFilters() && (
          <div className='w-full mb-4 p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground flex-wrap'>
              <Search className='w-4 h-4' />
              <span>Active filters:</span>
              {filters.categoryId && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Category:{' '}
                  {(function findCategoryPath(
                    cats: CategoryNode[],
                    targetId: string
                  ): string {
                    for (const cat of cats) {
                      if (cat.id === targetId) return cat.name
                      if (cat.children) {
                        const childPath = findCategoryPath(
                          cat.children,
                          targetId
                        )
                        if (childPath) return `${cat.name} > ${childPath}`
                      }
                    }
                    return ''
                  })(categoriesTree, filters.categoryId) || 'Unknown'}
                </span>
              )}
              {filters.condition && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Condition: {filters.condition}
                </span>
              )}
              {filters.cityId && filters.cityName && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  City: {filters.cityName}
                </span>
              )}
              {filters.customCity && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Custom City: {filters.customCity}
                </span>
              )}
              {filters.searchTerm && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Search: &quot;{filters.searchTerm}&quot;
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                </span>
              )}
              {filters.sortBy && (
                <span className='bg-background px-2 py-1 rounded text-xs'>
                  Sort:{' '}
                  {filters.sortBy === 'createdAt'
                    ? 'Date Posted'
                    : filters.sortBy === 'price'
                    ? 'Price'
                    : filters.sortBy === 'title'
                    ? 'Title'
                    : filters.sortBy}{' '}
                  ({filters.sortOrder === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </div>
            <Button
              variant='secondary'
              size='sm'
              onClick={clearAllFilters}
              className='text-sm mt-4'
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className='w-full mb-4 text-sm text-muted-foreground'>
          {`${filteredCount} listing${filteredCount !== 1 ? 's' : ''} found`}
        </div>

        {displayedListings.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
            {displayedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-lg text-muted-foreground mb-2'>
              No listings found
            </p>
            {hasActiveFilters() && (
              <Button
                variant='outline'
                onClick={clearAllFilters}
                className='mt-2'
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-4 mt-8'>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size={'icon'}
              variant={'outline'}
              className='rounded-full disabled:opacity-50'
            >
              <ChevronLeft />
            </Button>

            <span className='text-sm text-muted-foreground'>
              {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              size={'icon'}
              variant={'outline'}
              className='rounded-full disabled:opacity-50'
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
