import { test, expect } from '@playwright/test'

test.describe('Unauthenticated Redirects', () => {

    test('sell page redirects to login', async ({ page }) => {
        await page.goto('/sell')
        await expect(page.getByText(/please log in/i)).toBeVisible()
        await page.getByRole('button', { name: /go to login/i }).click()
        await expect(page).toHaveURL('/login')
    })

    test('my listings redirects to login', async ({ page }) => {
        await page.goto('/my-listings')
        await expect(page.getByText(/please log in/i)).toBeVisible()
        await page.getByRole('button', { name: /go to login/i }).click()
        await expect(page).toHaveURL('/login')
    })

    test('profile page redirects to login', async ({ page }) => {
        await page.goto('/profile')
        await expect(page.getByText(/please log in/i)).toBeVisible()
        await expect(page).toHaveURL('/login')
    })

})
