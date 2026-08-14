import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the same build works from a user page
// (hamzash47.github.io), a project page (/HamzAsh47.github.io-/),
// or a local `dist` preview without reconfiguration.
// Deep links use the hash router, so no server rewrite rules are needed.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
})
