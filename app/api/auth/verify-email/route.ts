import { NextRequest, NextResponse } from 'next/server'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.BACKEND_API_BASE ||
  'https://api.dealio.org.za'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        const redirectUrl = new URL('/verify-email', request.nextUrl.origin)
        redirectUrl.searchParams.set('success', 'false')
        redirectUrl.searchParams.set('error', 'Verification token is required')
        return NextResponse.redirect(redirectUrl)
    }

    const backendVerifyUrl = `${API_BASE}/api/auth/verify-email?token=${encodeURIComponent(token)}`
    return NextResponse.redirect(backendVerifyUrl)
}
