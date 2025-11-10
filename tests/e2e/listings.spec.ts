import { test, expect } from '@playwright/test'

test('user can view and filter listings', async ({ page }) => {
    await page.goto('/listings')

    // Ensure page loads with listings
    await expect(page.getByTestId('listing-card')).toHaveCount(8)

})

test('user can filter listings by category', async ({ page }) => {
    await page.goto('/listings')

    // Open filter drawer
    await page.getByRole('button', { name: /open filters/i }).click()

    // Select category dropdown in drawer
    await page.getByRole('button', { name: /select a category/i }).click()

    // Select a category (e.g., "Automotive")
    await page.getByText('Books & Media').click()


    // Apply filters (depends on your drawer's apply button)
    await page.getByRole('button', { name: /apply/i }).click()

    // Check filtered results
    const items = page.getByTestId('listing-card')
    await expect(items).toHaveCount(1)
})

test('user can see listing details', async ({ page }) => {
    await page.goto('/listings')

    // Click on the first listing
    const firstListing = page.getByTestId('listing-card').first()
    await firstListing.locator('a').click()

    // Ensure we are on the listing details page
    await expect(page).toHaveURL(/\/listings\/\d+/)

    // Check for listing title and price
    await expect(page.getByTestId('listing-title')).toBeVisible()
    await expect(page.getByTestId('listing-price')).toBeVisible()
})