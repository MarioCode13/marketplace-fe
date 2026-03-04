/**
 * Test utility for checking NSFWJS functionality
 * Run this in browser console to verify NSFWJS is working
 */

export async function testNSFWJSLoading() {
    try {
        console.log('Testing NSFWJS model loading...')
        const nsfwjs = await import('nsfwjs')
        console.log('NSFWJS module loaded:', nsfwjs)

        console.log('Loading model...')
        const model = await nsfwjs.load()
        console.log('NSFWJS model loaded successfully:', model)
        console.log(
            'Model info:',
            model.model ? 'Model instance exists' : 'No model instance'
        )
        return true
    } catch (error) {
        console.error('FAILED: NSFWJS model loading failed:', error)
        return false
    }
}

export async function testImageClassification(imageUrl: string) {
    try {
        console.log(`Testing image classification with: ${imageUrl}`)
        const nsfwjs = await import('nsfwjs')
        const model = await nsfwjs.load()

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = imageUrl

        await new Promise<void>((resolve) => {
            img.onload = () => resolve()
        })

        const predictions = await model.classify(img)
        console.log('Classification results:', predictions)

        // Print formatted results
        predictions.forEach((pred) => {
            console.log(`${pred.className}: ${(pred.probability * 100).toFixed(2)}%`)
        })

        return predictions
    } catch (error) {
        console.error('FAILED: Image classification failed:', error)
        return null
    }
}

// Make functions available in browser console
if (typeof window !== 'undefined') {
    interface WindowWithNSFWTest extends Window {
        testNSFWJS: {
            testLoading: typeof testNSFWJSLoading
            testClassification: typeof testImageClassification
        }
    }
    ; (window as unknown as WindowWithNSFWTest).testNSFWJS = {
        testLoading: testNSFWJSLoading,
        testClassification: testImageClassification,
    }
}
