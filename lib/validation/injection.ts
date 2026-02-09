/**
 * Detects potential code injection patterns in a string
 * Checks for common XSS, SQL injection, and script injection patterns
 * Returns true if suspicious patterns are detected, false if safe
 */
export function containsInjectionPatterns(value: string): boolean {
    if (!value || typeof value !== 'string') return false

    // Normalize the string (convert to lowercase for pattern matching)
    const normalized = value.toLowerCase().trim()

    // Script tags and event handlers
    const scriptPatterns = [
        /<script[^>]*>/i,              // <script> tags
        /on\w+\s*=/i,                 // onload=, onclick=, onerror=, etc.
        /javascript:/i,               // javascript: protocol
        /<iframe[^>]*>/i,             // <iframe> tags
        /<object[^>]*>/i,             // <object> tags
        /<embed[^>]*>/i,              // <embed> tags
        /<img[^>]*on\w+/i,            // <img onerror=, etc.
        /eval\s*\(/i,                 // eval()
        /expression\s*\(/i,           // CSS expression()
    ]

    // SQL injection patterns
    const sqlPatterns = [
        /('\s*(or|and)\s*'?[0-9]*\s*'?\s*=|(\d+)\s*(or|and)\s*(\d+)\s*=)/i, // ' OR '1'='1
        /(\bUNION\b.*\bSELECT\b)/i,   // UNION SELECT
        /(\bDROP\b.*\bTABLE\b)/i,     // DROP TABLE
        /(\bINSERT\b.*\bINTO\b)/i,    // INSERT INTO
        /(\bDELETE\b.*\bFROM\b)/i,    // DELETE FROM
        /(\bUPDATE\b.*\bSET\b)/i,     // UPDATE SET
        /;\s*(drop|delete|insert|update|select)/i, // ; followed by SQL command
    ]

    // Check all patterns
    const allPatterns = [...scriptPatterns, ...sqlPatterns]

    return allPatterns.some(pattern => pattern.test(normalized))
}

/**
 * Validates a string against injection patterns
 * Useful for zod validation: .refine(val => !containsInjectionPatterns(val), ...)
 * Returns true if SAFE (no injection patterns), false if UNSAFE
 */
export function isValidForInput(value: string | undefined): boolean {
    if (!value) return true
    return !containsInjectionPatterns(value)
}
