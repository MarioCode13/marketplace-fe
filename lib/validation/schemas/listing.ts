import { z } from 'zod'
import { isValidForInput } from '../injection'

export const listingSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must not exceed 100 characters')
        .refine(
            (val) => isValidForInput(val),
            'Title contains invalid characters or patterns'
        ),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters')
        .refine(
            (val) => isValidForInput(val),
            'Description contains invalid characters or patterns'
        ),
    price: z
        .string()
        .refine(
            (val) => !isNaN(parseFloat(val)),
            'Price must be a valid number'
        )
        .refine(
            (val) => parseFloat(val) > 0,
            'Price must be greater than 0'
        )
        .refine(
            (val) => parseFloat(val) <= 10000000,
            'Price must not exceed 10,000,000'
        ),
    condition: z
        .string()
        .min(1, 'Please select a condition')
        .refine(
            (val) => ['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR'].includes(val),
            'Invalid condition selected'
        ),
    categoryId: z
        .string()
        .min(1, 'Please select a category'),
    quantity: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d+$/.test(val),
            'Quantity must be a non-negative integer'
        )
        .refine(
            (val) => !val || parseInt(val, 10) >= 0,
            'Quantity must be non-negative'
        )
        .refine(
            (val) => !val || parseInt(val, 10) <= 999,
            'Quantity must not exceed 999'
        ),
    customCity: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 2,
            'Custom city must be at least 2 characters'
        )
        .refine(
            (val) => isValidForInput(val),
            'Custom city contains invalid characters or patterns'
        ),
})

export type ListingFormData = z.infer<typeof listingSchema>
