import { z } from 'zod'
import { isValidForInput } from '../injection'

export const profileSchema = z.object({
    firstName: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 2,
            'First name must be at least 2 characters'
        )
        .refine(
            (val) => !val || /^[a-zA-Z\s'-]+$/.test(val),
            'First name can only contain letters, spaces, hyphens, and apostrophes'
        )
        .refine(
            (val) => isValidForInput(val),
            'First name contains invalid characters or patterns'
        ),
    lastName: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 2,
            'Last name must be at least 2 characters'
        )
        .refine(
            (val) => !val || /^[a-zA-Z\s'-]+$/.test(val),
            'Last name can only contain letters, spaces, hyphens, and apostrophes'
        )
        .refine(
            (val) => isValidForInput(val),
            'Last name contains invalid characters or patterns'
        ),
    username: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 3,
            'Username must be at least 3 characters'
        )
        .refine(
            (val) => !val || /^[a-zA-Z0-9_]+$/.test(val),
            'Username can only contain letters, numbers, and underscores'
        )
        .refine(
            (val) => isValidForInput(val),
            'Username contains invalid characters or patterns'
        ),
    email: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            'Please enter a valid email address'
        )
        .refine(
            (val) => !val || isValidForInput(val),
            'Email contains invalid characters or patterns'
        ),
    bio: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length <= 500,
            'Bio must not exceed 500 characters'
        )
        .refine(
            (val) => isValidForInput(val),
            'Bio contains invalid characters or patterns'
        ),
    contactNumber: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[\d\s+\-()]+$/.test(val),
            'Please enter a valid phone number'
        )
        .refine(
            (val) => isValidForInput(val),
            'Contact number contains invalid patterns'
        ),
    idNumber: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length === 13,
            'ID number must be exactly 13 digits'
        )
        .refine(
            (val) => !val || /^\d+$/.test(val),
            'ID number must contain only digits'
        )
        .refine(
            (val) => isValidForInput(val),
            'ID number contains invalid patterns'
        ),
})

export type ProfileFormData = z.infer<typeof profileSchema>
