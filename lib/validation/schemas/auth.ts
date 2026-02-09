import { z } from 'zod'
import { isValidForInput } from '../injection'

export const registrationSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .refine(
            (val) => isValidForInput(val),
            'Username contains invalid characters or patterns'
        ),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            'Password must contain at least one special character'
        )
        .refine(
            (val) => isValidForInput(val),
            'Password contains invalid patterns'
        ),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
