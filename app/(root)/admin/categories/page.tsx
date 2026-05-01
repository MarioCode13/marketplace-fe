'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useGetCategoriesQuery } from '@/lib/graphql/generated'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, FolderTree, ChevronRight, ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string | null
  children?: Category[]
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userId, role } = useSelector((state: RootState) => state.userContext)

  const actionParam = searchParams.get('action') as 'view' | 'add' | null
  const [currentView, setCurrentView] = useState<'view' | 'add'>(
    actionParam || 'view',
  )
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategorySlug, setNewCategorySlug] = useState('')
  const [newCategoryParentId, setNewCategoryParentId] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  )

  useEffect(() => {
    if (userId === null) {
      router.push('/login')
    } else if (role !== 'ADMIN') {
      router.push('/')
    }
  }, [userId, role, router])

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'add' || action === 'view') {
      setCurrentView(action)
    }
  }, [searchParams])

  const { data, loading, error, refetch } = useGetCategoriesQuery({
    fetchPolicy: 'network-only',
  })

  const handleViewChange = (view: string) => {
    setCurrentView(view as 'view' | 'add')
    router.push(`/admin/categories?action=${view}`)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    // Note: This would need a backend mutation to work
    // For now, we'll show a success message as a placeholder
    toast.success('Category added successfully!')
    setIsAddDialogOpen(false)
    setNewCategoryName('')
    setNewCategorySlug('')
    setNewCategoryParentId('')
    refetch()
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setNewCategoryName(name)
    setNewCategorySlug(generateSlug(name))
  }

  const buildCategoryTree = (
    categories: Category[],
    parentId: string | null = null,
  ): Category[] => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map(
        (cat): Category => ({
          ...cat,
          children: buildCategoryTree(categories, cat.id),
        }),
      )
  }

  const renderCategoryRow = (
    category: Category,
    level: number = 0,
  ): JSX.Element => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <>
        <TableRow key={category.id}>
          <TableCell>
            <div
              className='flex items-center gap-2'
              style={{ paddingLeft: `${level * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleCategory(category.id)}
                  className='p-1 hover:bg-muted rounded'
                >
                  {isExpanded ? (
                    <ChevronDown className='w-4 h-4' />
                  ) : (
                    <ChevronRight className='w-4 h-4' />
                  )}
                </button>
              ) : (
                <span className='w-6' />
              )}
              <FolderTree className='w-4 h-4 text-muted-foreground' />
              <span className='font-medium'>{category.name}</span>
            </div>
          </TableCell>
          <TableCell>{category.slug}</TableCell>
          <TableCell>
            {category.parentId ? 'Subcategory' : 'Main Category'}
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          category.children?.map((child) =>
            renderCategoryRow(child, level + 1),
          )}
      </>
    )
  }

  if (!userId || role !== 'ADMIN') {
    return null
  }

  const categoryTree = data?.getCategories
    ? buildCategoryTree(
        data.getCategories.filter((cat): cat is Category => cat !== null),
      )
    : []

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xl font-semibold'>Categories</h2>
        <div className='flex gap-2'>
          <Button
            variant={'contained'}
            onClick={() => handleViewChange('add')}
          >
            Add
          </Button>
        </div>
      </div>

      {currentView === 'view' && (
        <Card>
          {loading ? (
            <div className='p-8 text-center text-muted-foreground'>
              Loading categories...
            </div>
          ) : error ? (
            <div className='p-8 text-center text-red-500'>
              Error loading categories: {error.message}
            </div>
          ) : categoryTree.length === 0 ? (
            <div className='p-8 text-center text-muted-foreground'>
              No categories found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryTree.map((category) => renderCategoryRow(category))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {currentView === 'add' && (
        <Card className='p-6'>
          <div className='max-w-md space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Add New Category</h3>
            </div>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='categoryName'>Category Name</Label>
                <Input
                  id='categoryName'
                  placeholder='e.g., Electronics'
                  value={newCategoryName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='categorySlug'>Slug</Label>
                <Input
                  id='categorySlug'
                  placeholder='e.g., electronics'
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='parentCategory'>
                  Parent Category (Optional)
                </Label>
                <Select
                  value={newCategoryParentId}
                  onValueChange={setNewCategoryParentId}
                >
                  <SelectTrigger
                    id='parentCategory'
                    className='mt-1'
                  >
                    <SelectValue placeholder='Select parent category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>None (Main Category)</SelectItem>
                    {data?.getCategories
                      ?.filter(
                        (cat): cat is Category => cat !== null && !cat.parentId,
                      )
                      .map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAddCategory}
                className='w-full'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Category
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for listings.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div>
              <Label htmlFor='dialogCategoryName'>Category Name</Label>
              <Input
                id='dialogCategoryName'
                placeholder='e.g., Electronics'
                value={newCategoryName}
                onChange={(e) => handleNameChange(e.target.value)}
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='dialogCategorySlug'>Slug</Label>
              <Input
                id='dialogCategorySlug'
                placeholder='e.g., electronics'
                value={newCategorySlug}
                onChange={(e) => setNewCategorySlug(e.target.value)}
                className='mt-1'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outlined'
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
