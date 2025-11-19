import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
}

interface CategoryCascaderProps {
  categories: CategoryNode[]
  value?: string
  onChange: (id: string, path: CategoryNode[]) => void
  placeholder?: string
  className?: string
}

export function findCategoryPath(
  categories: CategoryNode[],
  id?: string
): CategoryNode[] {
  if (!id) return []
  for (const cat of categories) {
    if (cat.id === id) return [cat]
    if (cat.children) {
      const childPath = findCategoryPath(cat.children, id)
      if (childPath.length) return [cat, ...childPath]
    }
  }
  return []
}

// Recursive menu rendering
function renderMenu(
  categories: CategoryNode[],
  onSelect: (cat: CategoryNode, path: CategoryNode[]) => void,
  parentPath: CategoryNode[] = [],
  selectedId?: string
) {
  return categories.map((cat) => {
    const path = [...parentPath, cat]

    if (cat.children && cat.children.length > 0) {
      return (
        <div
          key={cat.id}
          className='flex items-stretch'
        >
          {/* Selectable parent item */}
          <DropdownMenuItem
            onSelect={() => onSelect(cat, path)}
            className={
              selectedId === cat.id
                ? ' *: text-primary-foreground flex-1'
                : 'flex-1'
            }
          >
            {cat.name}
          </DropdownMenuItem>
          {/* Expandable submenu for children (arrow only) */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className='px-2 flex items-center'
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              tabIndex={-1} // prevent focus on arrow
            ></DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderMenu(cat.children, onSelect, path, selectedId)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </div>
      )
    } else {
      return (
        <DropdownMenuItem
          key={cat.id}
          role='menuitem'
          data-testid={`category-item-${cat.id}`}
          onSelect={() => onSelect(cat, path)}
          className={
            selectedId === cat.id ? 'bg-secondary text-primary-foreground' : ''
          }
        >
          {cat.name}
        </DropdownMenuItem>
      )
    }
  })
}

const CategoryCascader: React.FC<CategoryCascaderProps> = ({
  categories,
  value,
  onChange,
  placeholder = 'Select a Category',
  className,
}) => {
  const selectedPath = findCategoryPath(categories, value)
  const display =
    selectedPath.length > 0
      ? selectedPath.map((c) => c.name).join(' / ')
      : placeholder

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'outlined'}
          color={'input'}
          className={`w-full justify-between bg-transparent px-3  ${
            className || ''
          }`}
          aria-label='Category selector'
        >
          <span
            className={`block truncate ${
              selectedPath.length ? '' : 'text-muted-foreground'
            }`}
          >
            {display}
          </span>
          <ChevronDown className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='min-w-[220px] max-h-96 overflow-auto bg-popover'
        aria-label='Category selection menu'
      >
        {renderMenu(
          categories,
          (cat, path) => onChange(cat.id, path),
          [],
          value
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CategoryCascader
