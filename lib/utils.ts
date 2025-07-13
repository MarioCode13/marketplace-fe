import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a pre-signed URL for a B2 filename
 * This is a temporary solution until we implement proper URL generation
 * In production, this should be handled by the backend
 */
export function generateImageUrl(filename: string): string {
  // For now, return a placeholder or the filename as-is
  // In a real implementation, you would call the backend to generate a pre-signed URL
  if (filename.startsWith('http')) {
    return filename // Already a URL
  }

  // For development, you might want to return a placeholder image
  // or implement a proper URL generation mechanism
  return `/api/files/${filename}`
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
