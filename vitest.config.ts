import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'), // <-- same as tsconfig paths
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setupTests.ts',
        include: ['**/*.test.{ts,tsx}'],
    },
})
