import { NextRequest, NextResponse } from 'next/server'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.BACKEND_API_BASE ||
  'https://api.dealio.org.za'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 },
      )
    }

    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    })

    const raw = await response.text()
    let data: Record<string, unknown>
    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      data = { error: raw || 'Unexpected backend response' }
    }
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
