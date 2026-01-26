import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Drawer from './Drawer'
import { Label } from '../ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { X, Search, MapPin, Calendar, SortAsc, SortDesc } from 'lucide-react'
import CityAutocomplete from './CityAutocomplete'
import CategoryCascader, { CategoryNode } from './CategoryCascader'

type SortOrder = 'asc' | 'desc'

export interface FilterState {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  cityId?: string
  cityLabel?: string
  customCity?: string
  searchTerm?: string
  minDate?: string
  maxDate?: string
  sortBy?: string
  sortOrder?: SortOrder
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
  categories: CategoryNode[]
  currentFilters?: FilterState
}

const CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'HEAVILY_USED', label: 'Heavily Used' },
  { value: 'NEEDS_REPAIR', label: 'Needs Repair' },
  { value: 'FOR_PARTS', label: 'For Parts' },
]

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Posted' },
  { value: 'price', label: 'Price' },
  { value: 'title', label: 'Title' },
]

export default function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  categories,
  currentFilters = {},
}: FilterDrawerProps) {
  const toNumber = (v: string | number | undefined): number | undefined => {
    if (v === undefined || v === '') return undefined
    const n = typeof v === 'number' ? v : parseFloat(v)
    return Number.isNaN(n) ? undefined : n
  }

  const [filters, setFilters] = useState<FilterState>({
    categoryId: currentFilters.categoryId,
    minPrice: toNumber(currentFilters.minPrice),
    maxPrice: toNumber(currentFilters.maxPrice),
    condition: currentFilters.condition,
    cityId: currentFilters.cityId,
    customCity: currentFilters.customCity || '',
    cityLabel: currentFilters.cityLabel || '',
    searchTerm: currentFilters.searchTerm || '',
    minDate: currentFilters.minDate || '',
    maxDate: currentFilters.maxDate || '',
    sortBy: currentFilters.sortBy || 'createdAt',
    sortOrder: currentFilters.sortOrder || 'desc',
  })

  const [showCustomCity, setShowCustomCity] = useState(false)

  // Reset filters when drawer opens
  useEffect(() => {
    if (isOpen) {
      setFilters({
        categoryId: currentFilters.categoryId,
        minPrice: toNumber(currentFilters.minPrice),
        maxPrice: toNumber(currentFilters.maxPrice),
        condition: currentFilters.condition,
        cityId: currentFilters.cityId,
        customCity: currentFilters.customCity || '',
        cityLabel: currentFilters.cityLabel || '',
        searchTerm: currentFilters.searchTerm || '',
        minDate: currentFilters.minDate || '',
        maxDate: currentFilters.maxDate || '',
        sortBy: currentFilters.sortBy || 'createdAt',
        sortOrder: currentFilters.sortOrder || 'desc',
      })
    }
  }, [isOpen, currentFilters])

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilter = <K extends keyof FilterState>(key: K) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }))
  }

  const clearAllFilters = () => {
    setFilters({
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      cityId: undefined,
      customCity: '',
      cityLabel: '',
      searchTerm: '',
      minDate: '',
      maxDate: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }

  const applyFilters = () => {
    onApply(filters)
    onClose()
  }

  const hasActiveFilters = () => {
    return Object.values(filters).some((v) => v !== undefined && v !== '')
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filters'
    >
      <div className='flex flex-col max-w-80 h-full text-foreground'>
        {/* Filter content */}
        <div className='flex-1'>
          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className='flex flex-wrap gap-2 p-2 bg-muted rounded-lg'>
              <span className='text-sm font-medium text-foreground'>
                Active filters:
              </span>
              {filters.categoryId && (
                <Badge
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  Category:{' '}
                  {categories.find((c) => c.id === filters.categoryId)?.name}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => clearFilter('categoryId')}
                  />
                </Badge>
              )}
              {filters.condition && (
                <Badge
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  Condition:{' '}
                  {CONDITIONS.find((c) => c.value === filters.condition)?.label}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => clearFilter('condition')}
                  />
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => {
                      clearFilter('minPrice')
                      clearFilter('maxPrice')
                    }}
                  />
                </Badge>
              )}
              {(filters.cityId || filters.customCity || filters.cityLabel) && (
                <Badge
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  Location: {filters.customCity || filters.cityLabel || 'City'}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        cityId: undefined,
                        cityLabel: '',
                        customCity: '',
                      }))
                    }
                  />
                </Badge>
              )}
              {filters.searchTerm && (
                <Badge
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  Search: {filters.searchTerm}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => updateFilter('searchTerm', '')}
                  />
                </Badge>
              )}
              <Button
                variant='text'
                size='sm'
                onClick={clearAllFilters}
                className='h-6 px-2 text-xs'
              >
                Clear All
              </Button>
            </div>
          )}

          <div className='flex-col space-y-6 text-foreground'>
            {/* Search */}
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-foreground'>
                <Search className='w-4 h-4' />
                Search
              </Label>
              <Input
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                placeholder='Search titles and descriptions...'
                className='w-full'
              />
            </div>

            {/* Category */}
            <div className='space-y-2'>
              <Label className='text-foreground'>Category</Label>
              <CategoryCascader
                categories={categories as CategoryNode[]}
                value={filters.categoryId}
                onChange={(id) => updateFilter('categoryId', id)}
                placeholder='Select a Category'
              />
            </div>

            {/* Condition */}
            <div className='space-y-2'>
              <Label className='text-foreground'>Condition</Label>
              <Select
                value={filters.condition ?? 'all'}
                onValueChange={(value) =>
                  updateFilter('condition', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select Condition' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Conditions</SelectItem>
                  {CONDITIONS.map((condition) => (
                    <SelectItem
                      key={condition.value}
                      value={condition.value}
                    >
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-foreground'>
                <MapPin className='w-4 h-4' />
                Location
              </Label>
              <div className='flex flex-col gap-2'>
                {!showCustomCity && (
                  <CityAutocomplete
                    value={filters.cityId}
                    onChange={(cityId, cityLabel) => {
                      updateFilter('cityId', cityId)
                      // store short city name (first part before comma) for URL and display
                      const short = cityLabel
                        ? cityLabel.split(',')[0].trim()
                        : ''
                      updateFilter('cityLabel', short)
                      // Optionally store full label elsewhere if needed
                    }}
                    noCustomCity
                    onCantFindCity={() => setShowCustomCity(true)}
                  />
                )}
                {showCustomCity && (
                  <>
                    <label className='block  text-sm font-medium'>City</label>
                    <Input
                      placeholder='Enter your city...'
                      value={filters.customCity || ''}
                      onChange={(e) =>
                        updateFilter('customCity', e.target.value)
                      }
                    />
                  </>
                )}
                {showCustomCity && (
                  <Button
                    size='sm'
                    type='button'
                    onClick={() => setShowCustomCity(false)}
                  >
                    Cancel custom city
                  </Button>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className='space-y-2'>
              <Label className='text-foreground'>Price Range</Label>
              <div className='flex gap-2'>
                <Input
                  type='number'
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    updateFilter(
                      'minPrice',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  placeholder='Min'
                  className='flex-1'
                />
                <Input
                  type='number'
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    updateFilter(
                      'maxPrice',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  placeholder='Max'
                  className='flex-1'
                />
              </div>
            </div>

            {/* Date Range */}
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-foreground'>
                <Calendar className='w-4 h-4' />
                Date Posted
              </Label>
              <div className='flex gap-2'>
                <Input
                  type='date'
                  value={filters.minDate}
                  onChange={(e) => updateFilter('minDate', e.target.value)}
                  className='flex-1'
                />
                <Input
                  type='date'
                  value={filters.maxDate}
                  onChange={(e) => updateFilter('maxDate', e.target.value)}
                  className='flex-1'
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-foreground'>
                <SortAsc className='w-4 h-4' />
                Sort By
              </Label>
              <div className='flex gap-2'>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger className='flex-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={'outlined'}
                  color='input'
                  size='icon'
                  className='max-h-[35px]'
                  onClick={() =>
                    updateFilter(
                      'sortOrder',
                      filters.sortOrder === 'asc' ? 'desc' : 'asc',
                    )
                  }
                >
                  {filters.sortOrder === 'asc' ? (
                    <SortAsc className='w-4 h-4' />
                  ) : (
                    <SortDesc className='w-4 h-4' />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Action Buttons */}
        <div className='flex gap-2 mt-2 mb-1 px-1'>
          <Button
            variant={'contained'}
            color='secondary'
            onClick={applyFilters}
            className='w-1/2'
            data-filter-action='apply'
          >
            Apply Filters
          </Button>
          <Button
            variant='outlined'
            color={'primary'}
            onClick={onClose}
            className='w-1/2'
          >
            Close
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
