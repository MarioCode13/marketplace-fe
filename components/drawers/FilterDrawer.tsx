import React, { useState } from 'react'
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

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
  }) => void
  categories: { id: string; name: string }[]
}

export default function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  categories,
}: FilterDrawerProps) {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const applyFilters = () => {
    onApply({
      categoryId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    })
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title='Filters'
    >
      <div className='flex flex-col gap-4'>
        {/* Category Select */}
        <div className='flex flex-col'>
          <Label className='mb-2 text-foreground dark:text-foregroundDark'>
            Category
          </Label>
          <Select
            value={categoryId ?? 'all'}
            onValueChange={(value) =>
              setCategoryId(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Price Input */}
        <div className='flex flex-col'>
          <Label className='mb-2 text-foreground dark:text-foregroundDark'>
            Min Price
          </Label>
          <Input
            type='number'
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className='w-full border p-2 rounded bg-input text-foreground dark:bg-inputDark'
            placeholder='Min Price'
          />
        </div>

        {/* Max Price Input */}
        <div className='flex flex-col'>
          <Label className='mb-2 text-foreground dark:text-foregroundDark'>
            Max Price
          </Label>
          <Input
            type='number'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className='w-full border p-2 rounded bg-input text-foreground dark:bg-inputDark'
            placeholder='Max Price'
          />
        </div>

        {/* Apply Filters Button */}
        <Button
          className='w-full'
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </Drawer>
  )
}
