import { describe, it, expect } from 'vitest'
import { findCategoryPath, CategoryNode } from '@/components/drawers/CategoryCascader'

const categories: CategoryNode[] = [
    {
        id: 'clothing',
        name: 'Clothing',
        children: [
            { id: 'tops', name: 'Tops' },
            { id: 'pants', name: 'Pants' },
        ],
    },
    {
        id: 'electronics',
        name: 'Electronics',
        children: [
            { id: 'phones', name: 'Phones' },
            { id: 'laptops', name: 'Laptops' },
        ],
    },
]

describe('findCategoryPath', () => {
    it('returns full path for nested category', () => {
        const path = findCategoryPath(categories, 'tops')
        expect(path).toEqual([categories[0], categories[0].children![0]])
    })

    it('returns only top-level category if no children match', () => {
        const path = findCategoryPath(categories, 'clothing')
        expect(path).toEqual([categories[0]])
    })

    it('returns empty array if id is not found', () => {
        const path = findCategoryPath(categories, 'nonexistent')
        expect(path).toEqual([])
    })

    it('returns empty array if id is undefined', () => {
        const path = findCategoryPath(categories, undefined)
        expect(path).toEqual([])
    })
})
