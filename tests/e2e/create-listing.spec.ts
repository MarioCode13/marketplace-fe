import { test, expect } from '@playwright/test'

test.describe('Sell page (admin)', () => {
    test('admin can access /sell page', async ({ page }) => {
        await page.goto('/sell')
        await expect(page.getByText(/create a new listing/i)).toBeVisible()
    })

    test('image upload is disabled after 5 images', async ({ page }) => {
        await page.goto('/sell')
        const uploadInput = page.locator('input[type="file"]')

        for (let i = 0; i < 5; i++) {
            await uploadInput.setInputFiles({
                name: `image${i}.png`,
                mimeType: 'image/png',
                buffer: Buffer.from('fake image data'),
            })

            // Wait for the image to be uploaded and added to the preview
            // We expect i+1 images to be visible after each upload
            await page.waitForFunction(
                (count) => {
                    const items = document.querySelectorAll('[data-testid="image-preview-item"]')
                    return items.length === count
                },
                i + 1,
                { timeout: 5000 }
            )
        }

        await expect(page.getByTestId('image-preview-item')).toHaveCount(5)
        const uploadArea = page.getByTestId('image-upload-area')
        await expect(uploadArea).toHaveAttribute('data-disabled', 'true')
    })
})
