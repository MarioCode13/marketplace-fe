import { NextResponse } from 'next/server'
import { generateCsrfToken } from '@/lib/auth/auth'

export async function POST(req: Request) {
    try {
        const { token } = await req.json()
        const csrfToken = generateCsrfToken()

        const response = NextResponse.json({ success: true })

        // Set the auth token in an httpOnly cookie
        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            // Set max age based on token expiration
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        // Set CSRF token
        response.cookies.set({
            name: 'csrf-token',
            value: csrfToken,
            httpOnly: false, // Needs to be accessible by JS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })

        return response

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to set authentication: ' + error },
            { status: 500 }
        )
    }
}
