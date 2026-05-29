'use client'

import { useQuery } from '@apollo/client'
import { BRANDS_BY_CATEGORY } from '@/lib/graphql/queries/brands'
import { cn } from '@/lib/utils'

type Brand = {
  id: string
  name: string
  slug: string
}

type BrandsByCategoryData = {
  brandsByCategory: Brand[]
}

type BrandFilterChipsProps = {
  categoryId: string
  selectedBrandId?: string
  onSelect: (brandId: string | undefined) => void
  className?: string
  compact?: boolean
  disabled?: boolean
}

export default function BrandFilterChips({
  categoryId,
  selectedBrandId,
  onSelect,
  className,
  compact = false,
  disabled = false,
}: BrandFilterChipsProps) {
  const { data, loading } = useQuery<BrandsByCategoryData>(BRANDS_BY_CATEGORY, {
    variables: { categoryId },
    skip: !categoryId,
    fetchPolicy: 'cache-and-network',
  })

  const brands = data?.brandsByCategory ?? []

  if (!categoryId) return null

  if (loading && brands.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        Loading brands…
      </p>
    )
  }

  if (brands.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full', className)}>
      {!compact && (
        <p className='text-sm font-medium text-muted-foreground mb-2'>Brand</p>
      )}
      <div
        className='flex gap-2 overflow-x-auto pb-1 scrollbar-thin'
        role='group'
        aria-label='Filter by brand'
      >
        <button
          type='button'
          data-filter-nav
          disabled={disabled}
          onClick={() => onSelect(undefined)}
          className={cn(
            'shrink-0 rounded-md border px-3 py-1.5 text-sm transition-colors',
            !selectedBrandId
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted',
          )}
        >
          All brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand.id}
            type='button'
            data-filter-nav
            disabled={disabled}
            onClick={() => onSelect(brand.id)}
            className={cn(
              'shrink-0 rounded-md border px-3 py-1.5 text-sm transition-colors whitespace-nowrap',
              selectedBrandId === brand.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted',
            )}
          >
            {brand.name}
          </button>
        ))}
      </div>
    </div>
  )
}
