import { test, expect } from '@playwright/test'

test.describe('Register page', () => {
    test.beforeEach(async ({ page }) => {
        const context = page.context()
        await context.clearCookies()

        // Intercept GraphQL queries
        await page.route('**/graphql', (route, request) => {
            const postData = request.postDataJSON?.()
            if (postData?.operationName === 'MeQuery') {
                // Mock "no user logged in"
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: { me: null } }),
                })
            } else {
                route.continue()
            }
        })

        await page.goto('/register') // Now the mock is in place
    })

    test('should register successfully', async ({ page }) => {
        const randomId = Math.floor(Math.random() * 100000)
        const username = `testuser${randomId}`
        const email = `testuser${randomId}@example.com`
        const password = 'Password123!'

        await page.fill('input[name="username"]', username)
        await page.fill('input[name="email"]', email)
        await page.fill('input[name="password"]', password)

        const terms = page.locator('#terms')

        // Check it if not already checked
        if ((await terms.getAttribute('aria-checked')) === 'false') {
            await terms.click()
        }

        // Optional: assert it's checked
        await expect(terms).toHaveAttribute('aria-checked', 'true')

        await page.click('button[type="submit"]')

        // Wait for navigation to login page
        await expect(page).toHaveURL('/login')

        await expect(page.locator('text=Registration successful')).toBeVisible()
    })
})
