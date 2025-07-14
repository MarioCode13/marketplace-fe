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
