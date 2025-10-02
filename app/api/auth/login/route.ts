import { NextResponse } from 'next/server'
import { generateCsrfToken } from '@/lib/auth/auth'

export async function POST(req: Request) {
    try {
        const { token } = await req.json()
        const csrfToken = generateCsrfToken()

        const response = NextResponse.json({ success: true })

        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        // TODO: Update in prod
        response.cookies.set({
            name: 'csrf-token',
            value: csrfToken,
            httpOnly: false,
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
