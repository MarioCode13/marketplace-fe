// tests/utils/generateAdminStorage.js
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  console.log('➡️  Navigating to login page...')
  await page.goto(`${BASE_URL}/login`)

  // Fill in admin credentials
  await page.fill('input[name="emailOrUsername"]', 'admin')
  await page.fill('input[name="password"]', 'admin')
  await page.click('button[type="submit"]')

  // Wait until the main page loads after login
  await page.waitForURL(`${BASE_URL}/`, { timeout: 15000 })
  await page.waitForSelector('text=Welcome', { timeout: 10000 })

  console.log('✅ Logged in successfully, saving storage state...')

  const storageDir = path.resolve('./tests/utils/storage')
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }

  const storagePath = path.join(storageDir, 'admin.json')
  await context.storageState({ path: storagePath })

  console.log('✅ Admin storage state saved at', storagePath)

  await browser.close()
}

main().catch((err) => {
  console.error('❌ Error generating admin storage:', err)
  process.exit(1)
})
