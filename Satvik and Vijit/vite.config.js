import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Multi-tenant aware: the tenant build script (scripts/build-tenants.mjs) passes
// VITE_BASE and TENANT_OUT_DIR per tenant. A plain `npm run dev` / `npm run build`
// falls back to the original single-tenant defaults.
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  esbuild: {
    jsx: 'automatic',
  },
  base: process.env.VITE_BASE || '/coach-z-badminton/',
  build: process.env.TENANT_OUT_DIR
    ? { outDir: process.env.TENANT_OUT_DIR, emptyOutDir: true }
    : {},
})
