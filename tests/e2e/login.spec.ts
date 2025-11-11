import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
        await expect(page.locator('form')).toBeVisible()
    })

    test('admin can login successfully', async ({ page }) => {
        await page.fill('input[name="emailOrUsername"]', 'admin')
        await page.fill('input[name="password"]', 'admin')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/')
        await expect(page.locator('text=Welcome')).toBeVisible()
        await expect(page.locator('text=Login successful!')).toBeVisible()
    })

    test('shows error for invalid credentials', async ({ page }) => {
        // Optional: ignore the 401 in console to avoid failing the test
        page.on('pageerror', (err) => {
            if (!err.message.includes('401')) console.error(err)
        })

        // Fill wrong credentials
        await page.fill('input[name="emailOrUsername"]', 'admin')
        await page.fill('input[name="password"]', 'wrongpassword')
        await page.click('button[type="submit"]')

        // Wait for toast/error to appear
        await expect(
            page.locator('text=Login failed')
        ).toBeVisible()

        // Ensure we stay on the login page
        await expect(page).toHaveURL('/login')
    })
})
