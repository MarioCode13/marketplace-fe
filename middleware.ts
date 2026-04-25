import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Only apply to API routes that need protection
    if (!request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.next()
    }

    // Skip CSRF for unauthenticated auth flows (no XSRF cookie yet)
    const csrfExemptPaths = new Set([
        '/api/auth/login',
        '/api/auth/refresh',
        '/api/auth/resend-verification-email',
        '/api/auth/verify-email',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
    ])
    if (csrfExemptPaths.has(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    // For all other API routes, verify CSRF token (align with backend cookie/header names)
    const csrfToken = request.headers.get('x-xsrf-token')
    const cookieCsrfToken = request.cookies.get('XSRF-TOKEN')?.value

    if (!csrfToken || !cookieCsrfToken || csrfToken !== cookieCsrfToken) {
        return NextResponse.json(
            { error: 'Invalid CSRF token' },
            { status: 403 }
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
