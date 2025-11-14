import { chromium } from '@playwright/test'

async function globalSetup() {
    const baseURL = 'http://localhost:3000'
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    // Navigate to login page
    await page.goto(`${baseURL}/login`, { waitUntil: 'networkidle' })

    // Fill in login form
    await page.fill('input[name="emailOrUsername"]', 'admin')
    await page.fill('input[name="password"]', 'admin')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for successful login - wait for redirect to home or any page load
    await page.waitForURL(`${baseURL}/**`, { waitUntil: 'networkidle' })

    // Wait a bit for the Redux state to be fully set up
    await page.waitForTimeout(1000)

    // Save storage state (cookies, localStorage, sessionStorage)
    await context.storageState({ path: 'auth.json' })

    await context.close()
    await browser.close()
}

export default globalSetup
