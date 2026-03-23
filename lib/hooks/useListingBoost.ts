'use client'

import { useState } from 'react'

type ListingBoostResponse = {
    success?: boolean
    message?: string
    userId?: string
    listingId?: string
    durationDays?: number
    mode?: string
    url?: string
    redirectUrl?: string
}

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
}

const fetchCsrfToken = async (apiBase: string): Promise<string | null> => {
    try {
        const res = await fetch(`${apiBase}/api/auth/csrf`, {
            credentials: 'include',
        })
        if (res.ok) {
            const body = await res.json()
            return (
                body?.csrfToken ||
                body?.csrf_token ||
                body?.token ||
                body?.xsrfToken ||
                body?.xsrf_token ||
                null
            )
        }
    } catch {
        // ignore
    }
    return null
}

const parseResponse = async (res: Response): Promise<ListingBoostResponse> => {
    const text = await res.text()

    if (!text.trim()) {
        return { success: res.ok, message: res.ok ? 'Boost activated successfully' : 'Empty response' }
    }

    if (/^(https?:)?\/\//i.test(text)) {
        return { success: true, url: text.trim() }
    }

    try {
        const payload = JSON.parse(text)
        if (payload) {
            if (payload.success === false) {
                return payload
            }
            if (payload.url || payload.redirectUrl) {
                return payload
            }
            if (typeof payload.success === 'boolean') {
                return payload
            }
        }
    } catch {
        // not JSON; return as message
        return { success: res.ok, message: text }
    }

    return { success: res.ok, message: text }
}

const postBoostActivate = async (
    listingId: string,
    durationDays: number,
): Promise<ListingBoostResponse> => {
    const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE ||
        ''

    const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            apiBase.includes('localhost') ||
            process.env.NODE_ENV === 'development')

    if (isLocal) {
        let csrfToken =
            getCookie('csrfToken') ||
            getCookie('XSRF-TOKEN') ||
            getCookie('csrf') ||
            getCookie('csrf_token') ||
            getCookie('CSRF-TOKEN') ||
            null

        if (!csrfToken) {
            csrfToken = await fetchCsrfToken(apiBase)
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        if (csrfToken) {
            headers['X-CSRF-Token'] = csrfToken
            headers['X-XSRF-TOKEN'] = csrfToken
        }

        const res = await fetch(`${apiBase}/api/payments/payfast/boost-activate`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({ listingId, durationDays }),
        })

        if (res.status === 404) {
            throw new Error('Boost activation endpoint not available (404)')
        }

        const parsed = await parseResponse(res)

        if (!res.ok && parsed.message) {
            throw new Error(parsed.message)
        }

        return parsed
    }

    // Non-local production path also hits endpoint (API may redirect to PayFast)
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    const res = await fetch(`${apiBase}/api/payments/payfast/boost-activate`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ listingId, durationDays }),
    })

    if (res.status === 404) {
        throw new Error('Boost activation endpoint not available (404)')
    }

    const parsed = await parseResponse(res)

    if (!res.ok && parsed.message) {
        throw new Error(parsed.message)
    }

    return parsed
}

export default function useListingBoost() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const activateBoost = async (listingId: string, durationDays = 30) => {
        setLoading(true)
        setError(null)

        try {
            const data = await postBoostActivate(listingId, durationDays)

            if (!data.success) {
                throw new Error(data.message || 'Failed to activate boost')
            }

            return data
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    return { activateBoost, loading, error }
}
