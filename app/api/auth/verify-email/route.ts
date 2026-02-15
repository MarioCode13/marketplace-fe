import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.BACKEND_API_BASE || 'https://api.dealio.org.za'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            )
        }

        const response = await fetch(`${API_BASE}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to verify email' },
                { status: response.status }
            )
        }

        return NextResponse.json(
            { message: 'Email verified successfully', data },
            { status: 200 }
        )
    } catch (error) {
        console.error('Email verification error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
