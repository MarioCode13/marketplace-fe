export const REFERRAL_QUERY_PARAM = 'ref'
export const REFERRAL_STORAGE_KEY = 'dealio_referral_code'

/** Normalize referral codes from URL or manual entry (matches backend). */
export function normalizeReferralCode(raw: string | null | undefined): string | null {
  if (raw == null || !raw.trim()) return null
  const code = raw.trim().toUpperCase()
  if (code.length < 4) return null
  return code
}
