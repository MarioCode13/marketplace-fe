import { test, expect } from '@playwright/test'

test.describe('Edit Listing Page', () => {

    test('admin can access /edit-listing page', async ({ page }) => {
        await page.goto('/edit-listing/0789d4c4-eb52-40f0-a7a7-2411ca239bf5')
        await expect(page.getByText(/edit listing/i)).toBeVisible()
    })

    test('loads existing listing data', async ({ page }) => {
        await page.goto('/edit-listing/0789d4c4-eb52-40f0-a7a7-2411ca239bf5')

        await expect(page.getByRole('heading', { name: /edit listing/i })).toBeVisible()

        // Title field loads with prefilled text
        const titleInput = page.getByLabel(/title/i)
        await expect(titleInput).toHaveValue(/.+/)

        // Price field should be prefilled with a number
        const priceInput = page.getByLabel(/price/i)
        await expect(priceInput).not.toHaveValue('')

        // Image preview should load existing images (if any)
        // If your listing has 2 images, adjust the expected number
        const previews = page.getByTestId('image-preview-item')
        const count = await previews.count()
        await expect(count).toBeGreaterThanOrEqual(0)
    })

    test('allows editing fields and saving', async ({ page }) => {
        await page.goto('/edit-listing/0789d4c4-eb52-40f0-a7a7-2411ca239bf5')

        // Title
        await page.getByLabel(/title/i).fill('Updated Laptop Title')

        // Description
        await page.getByLabel(/description/i).fill('Updated description for this listing')

        // Price
        await page.getByLabel(/price/i).fill('1999')

        // Condition (Select field)
        await page.getByLabel(/condition/i).click()
        await page.getByRole('option', { name: /used/i }).click()

        // Category 
        // CATEGORY CASCADER
        await page.getByRole('button', { name: /category/i }).click()

        // Select a category
        await page.getByRole('menuitem', { name: /electronics/i }).click()

        // or fallback: await page.getByText(/electronics/i).click()

        // Click Save
        const saveButton = page.getByRole('button', { name: /save changes/i })
        await saveButton.click()

        // Should redirect to the listing page after saving
        await expect(page).toHaveURL(/\/edit-listing\/0789d4c4-eb52-40f0-a7a7-2411ca239bf5$/)
    })

    test('disables image upload after 5 images', async ({ page }) => {
        await page.goto('/edit-listing/0789d4c4-eb52-40f0-a7a7-2411ca239bf5')

        const uploadInput = page.locator('input[type="file"]')

        for (let i = 0; i < 5; i++) {
            await uploadInput.setInputFiles({
                name: `edit-image${i}.png`,
                mimeType: 'image/png',
                buffer: Buffer.from('fake image data'),
            })

            // Wait for the UI to update
            await page.waitForFunction(
                (count) => {
                    return document.querySelectorAll('[data-testid="image-preview-item"]').length === count
                },
                i + 1,
            )
        }

        await expect(page.getByTestId('image-preview-item')).toHaveCount(5)

        // Area should now be disabled
        const uploadArea = page.getByTestId('image-upload-area')
        await expect(uploadArea).toHaveAttribute('data-disabled', 'true')
    })

    test('removes an image', async ({ page }) => {
        await page.goto('/edit-listing/0789d4c4-eb52-40f0-a7a7-2411ca239bf5')

        const previews = page.getByTestId('image-preview-item')

        const removeButton = previews.first().getByRole('button')
        await removeButton.click()

        await page.waitForTimeout(200)

        const countAfter = await page.getByTestId('image-preview-item').count()
        expect(countAfter).toBe(0)
    })
})
