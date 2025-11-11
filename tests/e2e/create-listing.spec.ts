import { test, expect } from '@playwright/test'

test.describe('Sell page (admin)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="emailOrUsername"]', 'admin')
        await page.fill('input[name="password"]', 'admin')
        await page.click('button[type="submit"]')
        await expect(page.locator('text=Welcome')).toBeVisible()
    })

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
        }

        await expect(page.getByTestId('image-preview-item')).toHaveCount(5)
        const uploadArea = page.getByTestId('image-upload-area')
        await expect(uploadArea).toHaveAttribute('data-disabled', 'true')
    })
})
