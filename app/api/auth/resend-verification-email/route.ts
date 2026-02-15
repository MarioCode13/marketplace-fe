import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.BACKEND_API_BASE || 'https://api.dealio.org.za'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE}/api/auth/resend-verification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to resend verification email' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { message: 'Verification email resent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
