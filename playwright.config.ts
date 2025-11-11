import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    storageState: undefined,
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  // globalSetup: './playwright.global-setup.ts'
})
