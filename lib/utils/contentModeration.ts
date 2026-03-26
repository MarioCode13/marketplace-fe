import * as nsfwjs from 'nsfwjs'

// Cache the model to avoid reloading it
let nsfwModel: nsfwjs.NSFWJS | null = null

/**
 * Load NSFWJS model (cached)
 */
async function loadNSFWModel() {
    if (nsfwModel) return nsfwModel

    try {
        console.log('Attempting to load NSFWJS model...')
        // Try loading with default config first
        nsfwModel = await nsfwjs.load()
        console.log('✓ NSFWJS model loaded successfully')
        return nsfwModel
    } catch (error) {
        console.error('✗ Failed to load NSFWJS model with default config:', error)
        // Try with explicit model path
        try {
            console.log('Attempting to load NSFWJS with custom model path...')
            nsfwModel = await nsfwjs.load()
            console.log('✓ NSFWJS model loaded with custom config')
            return nsfwModel
        } catch (fallbackError) {
            console.error('✗ Failed to load NSFWJS model with custom config:', fallbackError)
            throw fallbackError
        }
    }
}

/**
 * Classification result from NSFWJS
 */
export interface NSFWClassification {
    porn: number
    hentai: number
    sexy: number
    neutral: number
    drawing: number
}

/**
 * Check if an image contains explicit content
 * @param file - Image file to check
 * @param threshold - Confidence threshold (0-1) to flag content as explicit. Default: 0.3
 * @returns Object with classification scores and isExplicit flag
 */
export async function checkImageContent(
    file: File,
): Promise<{
    isExplicit: boolean
    classification: NSFWClassification
    reason?: string
}> {
    try {
        if (!file.type.startsWith('image/')) {
            return {
                isExplicit: false,
                classification: {
                    porn: 0,
                    hentai: 0,
                    sexy: 0,
                    neutral: 1,
                    drawing: 0,
                },
                reason: 'File is not an image. Skipping NSFW check.',
            }
        }

        const model = await loadNSFWModel()

        // Convert File to HTMLImageElement for NSFWJS
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = URL.createObjectURL(file)

        // Wait for image to load with timeout
        await Promise.race([
            new Promise<void>((resolve) => {
                img.onload = () => resolve()
            }),
            new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error('Image load timeout')), 5000)
            ),
        ])

        // Run classification
        const predictions = await model.classify(img)

        // Log predictions for debugging
        console.log('NSFWJS Predictions:', predictions)

        // Clean up
        URL.revokeObjectURL(img.src)

        // Convert predictions array to object for easier access
        const classification: NSFWClassification = {
            porn: 0,
            hentai: 0,
            sexy: 0,
            neutral: 0,
            drawing: 0,
        }

        let isExplicit = false
        predictions.forEach((pred) => {
            const className = pred.className.toLowerCase() as keyof NSFWClassification
            classification[className] = pred.probability
        })

        // Check explicit content criteria
        // Lingerie/fashion has: moderate porn + sexy, low hentai/drawing
        // True explicit content has: high porn OR high hentai (>0.6)
        // OR extreme sexy with near-zero neutral = naked person
        // OR moderate porn (10%+) with high sexy and low neutral
        // OR high neutral (nude person) with very low porn/hentai/sexy
        const isPornHigh = classification.porn > 0.6
        const isHentaiHigh = classification.hentai > 0.6
        const isModeratePorn =
            classification.porn > 0.1 && // Moderate porn score (10%+)
            classification.sexy > 0.6 && // High sexiness
            classification.neutral < 0.1 // Very low neutral (minimal clothing)
        const isExplicitNudity =
            classification.sexy > 0.95 && // Very high sexiness
            classification.neutral < 0.05 && // Almost completely no clothing detected
            classification.porn > 0.05 // Some pornographic content detected
        const isNonSuggestiveNude =
            classification.neutral > 0.4 && // Person/body detected
            classification.porn < 0.15 && // Not pornographic
            classification.hentai < 0.15 && // Not hentai
            classification.sexy < 0.4 && // Not suggestive
            (classification.porn > 0.02 || classification.sexy > 0.1) // But has some adult indicator
        const isFashionLikely =
            classification.sexy > 0.3 && // Has some sexiness (artistic)
            classification.hentai < 0.3 && // Not drawn/hentai
            classification.drawing < 0.3 // Not a drawing

        // Block if: explicit nudity, moderate porn, non-suggestive nude, OR (high porn/hentai AND not fashion)
        if (isExplicitNudity) {
            console.warn(
                `EXPLICIT NUDITY DETECTED: sexy=${(classification.sexy * 100).toFixed(1)}% with neutral=${(classification.neutral * 100).toFixed(1)}% (naked person)`
            )
            isExplicit = true
        } else if (isModeratePorn) {
            console.warn(
                `PORNOGRAPHIC CONTENT DETECTED: porn=${(classification.porn * 100).toFixed(1)}% with sexy=${(classification.sexy * 100).toFixed(1)}% and neutral=${(classification.neutral * 100).toFixed(1)}%`
            )
            isExplicit = true
        } else if (isNonSuggestiveNude) {
            console.warn(
                `NUDE PERSON DETECTED: neutral=${(classification.neutral * 100).toFixed(1)}% with porn=${(classification.porn * 100).toFixed(1)}% sexy=${(classification.sexy * 100).toFixed(1)}%`
            )
            isExplicit = true
        } else if ((isPornHigh || isHentaiHigh) && !isFashionLikely) {
            console.warn(
                `EXPLICIT CONTENT DETECTED: porn=${(classification.porn * 100).toFixed(1)}% hentai=${(classification.hentai * 100).toFixed(1)}% (sexy=${(classification.sexy * 100).toFixed(1)}%, neutral=${(classification.neutral * 100).toFixed(1)}%, drawing=${(classification.drawing * 100).toFixed(1)}%)`
            )
            isExplicit = true
        }

        const result: {
            isExplicit: boolean
            classification: NSFWClassification
            reason?: string
        } = {
            isExplicit,
            classification,
        }

        if (isExplicit) {
            result.reason = `Image detected as potentially explicit content (porn: ${(classification.porn * 100).toFixed(1)}%, hentai: ${(classification.hentai * 100).toFixed(1)}%, sexy: ${(classification.sexy * 100).toFixed(1)}%, neutral: ${(classification.neutral * 100).toFixed(1)}%, drawing: ${(classification.drawing * 100).toFixed(1)}%)`
        }

        return result
    } catch (error) {
        console.error('✗ ERROR checking image content:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
        })
        // WARN: Allowing upload on error - model may not be loaded correctly
        // Check browser console for NSFWJS loading errors
        return {
            isExplicit: false,
            classification: {
                porn: 0,
                hentai: 0,
                sexy: 0,
                neutral: 1,
                drawing: 0,
            },
            reason: 'Content moderation model unavailable (see browser console). Upload allowed.',
        }
    }
}

/**
 * Check if an image should be flagged for admin approval (18+ content)
 * This is less strict than checkImageContent - allows uploads but marks them for review
 * @param file - Image file to check
 * @returns Object with isFlagged status, classification scores, and message
 */
export async function checkImageForApproval(
    file: File,
): Promise<{
    isFlagged: boolean
    classification: NSFWClassification
    message?: string
}> {
    try {
        if (!file.type.startsWith('image/')) {
            return {
                isFlagged: false,
                classification: {
                    porn: 0,
                    hentai: 0,
                    sexy: 0,
                    neutral: 1,
                    drawing: 0,
                },
            }
        }

        const model = await loadNSFWModel()

        // Convert File to HTMLImageElement for NSFWJS
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = URL.createObjectURL(file)

        // Wait for image to load with timeout
        await Promise.race([
            new Promise<void>((resolve) => {
                img.onload = () => resolve()
            }),
            new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error('Image load timeout')), 5000)
            ),
        ])

        // Run classification
        const predictions = await model.classify(img)

        // Log predictions for debugging
        console.log('NSFWJS Predictions:', predictions)

        // Clean up
        URL.revokeObjectURL(img.src)

        // Convert predictions array to object for easier access
        const classification: NSFWClassification = {
            porn: 0,
            hentai: 0,
            sexy: 0,
            neutral: 0,
            drawing: 0,
        }

        predictions.forEach((pred) => {
            const className = pred.className.toLowerCase() as keyof NSFWClassification
            classification[className] = pred.probability
        })

        // Flag for approval if any adult content indicators are present
        // Much more lenient than the explicit content detection
        // Flags: porn > 2%, hentai > 2%, OR (sexy > 15% AND neutral < 80% AND (porn > 3% OR hentai > 3%))
        const hasPornContent = classification.porn > 0.02
        const hasHentaiContent = classification.hentai > 0.02
        const hasSuggestiveContent =
            classification.sexy > 0.15 && classification.neutral < 0.8 && (classification.porn > 0.03 || classification.hentai > 0.03)
        const isFlagged = hasPornContent || hasHentaiContent || hasSuggestiveContent

        let message: string | undefined
        if (isFlagged) {
            message = 'Image contains potentially explicit content. This listing will require admin approval before appearing on the live listings page.'
        }

        return {
            isFlagged,
            classification,
            message,
        }
    } catch (error) {
        console.error('✗ ERROR checking image for approval:', error)
        // On error, don't flag - allow upload
        return {
            isFlagged: false,
            classification: {
                porn: 0,
                hentai: 0,
                sexy: 0,
                neutral: 1,
                drawing: 0,
            },
        }
    }
}
