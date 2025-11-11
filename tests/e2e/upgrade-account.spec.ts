import { test, expect } from '@playwright/test'

test('user can upgrade account type', async ({ page }) => {
    await page.goto('/login')

    // login first
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    await page.goto('/account')

    await page.click('button#upgrade') // assuming a button to upgrade
    await page.selectOption('select#accountType', 'premium') // select new type
    await page.click('button#confirmUpgrade')

    await expect(page.locator('text=Premium Account')).toBeVisible()
})
