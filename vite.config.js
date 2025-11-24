import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // Base path for GitHub Pages (replace 'vs_audio' with your repository name)
  // If deploying to root domain, use '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/vs_audio/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
