import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fixes legacy rows where an external URL was incorrectly stored as a B2 object key.
 */
export function unwrapMalformedB2ImageUrl(url: string): string {
  if (!url?.includes('backblazeb2.com')) return url
  const searchFrom = url.startsWith('https://') ? 8 : url.startsWith('http://') ? 7 : 0
  const nestedHttps = url.indexOf('https://', searchFrom)
  const nestedHttp =
    nestedHttps < 0 ? url.indexOf('http://', searchFrom) : -1
  const nested = nestedHttps >= 0 ? nestedHttps : nestedHttp
  if (nested < 0) return url
  const inner = url.slice(nested)
  const authIdx = inner.indexOf('?Authorization=')
  return authIdx > 0 ? inner.slice(0, authIdx) : inner
}

/**
 * Generates a safe image URL for display.
 * Listings should receive pre-signed URLs from the API; this normalizes edge cases.
 */
export function generateImageUrl(filename: string): string {
  if (!filename) return '/logo.png'

  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return unwrapMalformedB2ImageUrl(filename)
  }

  return '/logo.png'
}

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

/**
 * Determines if a hex color is light or dark
 * Uses brightness calculation based on human eye sensitivity
 */
export function isLightColor(hexColor: string): boolean {
  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // Calculate brightness using human eye sensitivity
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}

/**
 * Returns appropriate text color (black or white) based on background color
 */
export function getTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff'
}

export interface FlatCategory {
  id: string
  name: string
  slug?: string
  parentId?: string | null
  sortOrder?: number
}

export interface CategoryNode {
  id: string
  name: string
  sortOrder?: number
  children?: CategoryNode[]
}

function sortCategorySiblings(nodes: CategoryNode[]): void {
  nodes.sort((a, b) => {
    const orderA = a.sortOrder ?? 0
    const orderB = b.sortOrder ?? 0
    if (orderA !== orderB) return orderA - orderB
    return a.name.localeCompare(b.name)
  })
  nodes.forEach((node) => {
    if (node.children?.length) sortCategorySiblings(node.children)
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildCategoryTree(flat: FlatCategory[]): CategoryNode[] {
  const idToNode: Record<string, CategoryNode> = {}
  const roots: CategoryNode[] = []

  // First, create a map of all nodes
  flat.forEach(cat => {
    idToNode[cat.id] = {
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder ?? 0,
      children: [],
    }
  })

  // Then, assign children to parents
  flat.forEach(cat => {
    if (cat.parentId && idToNode[cat.parentId]) {
      idToNode[cat.parentId].children!.push(idToNode[cat.id])
    } else {
      roots.push(idToNode[cat.id])
    }
  })

  // Remove empty children arrays for leaf nodes
  function clean(node: CategoryNode) {
    if (node.children && node.children.length === 0) delete node.children
    else if (node.children) node.children.forEach(clean)
  }
  roots.forEach(clean)
  sortCategorySiblings(roots)

  return roots
}

/**
 * Builds the full category path (parent/child) for a given category ID
 * Returns an array of slugs from root to the category
 */
export function buildCategoryPath(
  categoryId: string,
  categories: FlatCategory[]
): string[] {
  const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
  const path: string[] = []

  let currentId: string | null | undefined = categoryId

  // Walk up the parent chain
  while (currentId) {
    const cat = categoryMap.get(currentId)
    if (!cat) break

    const slug = cat.slug || slugify(cat.name)
    path.unshift(slug) // Add to beginning to maintain root-to-leaf order

    currentId = cat.parentId
  }

  return path
}

export function formatEnum(value: string | null | undefined) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}