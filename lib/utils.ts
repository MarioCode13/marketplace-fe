import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a safe image URL for display
 * Handles both pre-signed URLs and relative filenames
 */
export function generateImageUrl(filename: string): string {
  // If it's already a valid URL, return it
  if (filename && (filename.startsWith('http://') || filename.startsWith('https://'))) {
    return filename
  }

  // If it's a relative filename, return a placeholder
  // In production, this should be handled by the backend
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
  parentId?: string | null
  // ...other fields
}

export interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
}

export function buildCategoryTree(flat: FlatCategory[]): CategoryNode[] {
  const idToNode: Record<string, CategoryNode> = {}
  const roots: CategoryNode[] = []

  // First, create a map of all nodes
  flat.forEach(cat => {
    idToNode[cat.id] = { id: cat.id, name: cat.name, children: [] }
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

  return roots
}

export function formatEnum(value: string) {
  return value
    .toLowerCase()              // new, like_new, excellent
    .split('_')                 // ["like", "new"]
    .map(word => word[0].toUpperCase() + word.slice(1)) // ["Like", "New"]
    .join(' ')                  // "Like New"
}