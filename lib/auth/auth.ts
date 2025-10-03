import { jwtDecode } from 'jwt-decode'

export interface DecodedToken {
    id: string
    username: string
    role: 'VISITOR' | 'HAS_ACCOUNT' | 'SUBSCRIBED'
    exp: number
    userId: string
}

// CSRF token management
export function generateCsrfToken() {
    return crypto.randomUUID()
}

export function getSessionData() {
    if (typeof window === 'undefined') return null

    const csrfToken = document.cookie.split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1]

    return { csrfToken }
}

// Token validation
export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<DecodedToken>(token)
        return decoded.exp * 1000 < Date.now()
    } catch {
        return true
    }
}

// No localStorage token usage by design (httpOnly cookie + CSRF)

// Cookie utilities
export function getCookie(name: string): string | undefined {
    if (typeof window === 'undefined') return undefined

    return document.cookie.split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1]
}

export async function refreshToken(): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include', // Important for cookies
            headers: {
                'X-CSRF-Token': getCookie('csrf-token') || '',
            },
        })

        if (!response.ok) {
            throw new Error('Token refresh failed')
        }

        const data = await response.json()
        return data.success
    } catch {
        return false
    }
}
