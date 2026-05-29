'use client'

import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SEARCH_BRANDS } from '@/lib/graphql/queries/brands'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BrandOption = {
  id: string
  name: string
  slug: string
}

type SearchBrandsData = {
  searchBrands: BrandOption[]
}

type SearchBrandsVars = {
  categoryId: string
  query: string
}

type BrandPickerProps = {
  categoryId: string | undefined
  value: string
  onChange: (brandName: string) => void
  disabled?: boolean
  className?: string
}

export default function BrandPicker({
  categoryId,
  value,
  onChange,
  disabled,
  className,
}: BrandPickerProps) {
  const [inputValue, setInputValue] = useState(value)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(inputValue.trim()), 250)
    return () => clearTimeout(t)
  }, [inputValue])

  const { data, loading } = useQuery<SearchBrandsData, SearchBrandsVars>(
    SEARCH_BRANDS,
    {
      variables: {
        categoryId: categoryId!,
        query: debouncedQuery,
      },
      skip: !categoryId,
      fetchPolicy: 'cache-and-network',
    },
  )

  const suggestions = useMemo(() => data?.searchBrands ?? [], [data])

  const noCategory = !categoryId

  return (
    <div className={cn('space-y-2', className)}>
      <Label>Brand (optional)</Label>
      <div className='relative'>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150)
          }}
          placeholder={
            noCategory
              ? 'Select a category first'
              : 'Search or type a brand name'
          }
          disabled={disabled || noCategory}
          autoComplete='off'
        />
        {value && !noCategory && (
          <Button
            type='button'
            variant='text'
            size='icon'
            className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2'
            onClick={() => {
              setInputValue('')
              onChange('')
            }}
            aria-label='Clear brand'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
        {open && categoryId && (suggestions.length > 0 || loading) && (
          <ul
            className='absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-md'
            role='listbox'
          >
            {loading && (
              <li className='px-3 py-2 text-sm text-muted-foreground'>
                Loading…
              </li>
            )}
            {!loading &&
              suggestions.map((brand) => (
                <li key={brand.id}>
                  <button
                    type='button'
                    className='w-full px-3 py-2 text-left text-sm hover:bg-accent'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setInputValue(brand.name)
                      onChange(brand.name)
                      setOpen(false)
                    }}
                  >
                    {brand.name}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
      <p className='text-xs text-muted-foreground'>
        Pick an existing brand or enter a new one for this category.
      </p>
    </div>
  )
}
