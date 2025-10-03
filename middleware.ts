import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Only apply to API routes that need protection
    if (!request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.next()
    }

    // Skip CSRF check for login and refresh token endpoints
    if (request.nextUrl.pathname === '/api/auth/login' ||
        request.nextUrl.pathname === '/api/auth/refresh') {
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
