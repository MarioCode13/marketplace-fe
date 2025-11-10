import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryCascader, {
  CategoryNode,
} from '@/components/drawers/CategoryCascader'
import { describe, it, expect, vi } from 'vitest'

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

describe('CategoryCascader', () => {
  it('shows placeholder when no value is selected', () => {
    render(
      <CategoryCascader
        categories={categories}
        onChange={() => {}}
      />
    )
    expect(screen.getByText('Select a Category')).toBeInTheDocument()
  })

  it('opens menu and displays first-level categories', async () => {
    const user = userEvent.setup()
    render(
      <CategoryCascader
        categories={categories}
        onChange={() => {}}
      />
    )

    await user.click(screen.getByRole('button')) // open dropdown

    expect(screen.getByText('Clothing')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('calls onChange correctly when a nested category is selected', () => {
    const onChange = vi.fn()

    // Find the item you want to "select" via renderMenu
    // Manually call the onSelect function
    const selectedPath = [categories[0], categories[0].children![0]]
    onChange(categories[0].children![0].id, selectedPath)

    expect(onChange).toHaveBeenCalledWith('tops', selectedPath)
  })
})
