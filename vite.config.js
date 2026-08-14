// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The base path MUST match your GitHub repo name exactly, since GitHub
// Pages serves project sites from https://username.github.io/repo-name/
// rather than the domain root.
export default defineConfig({
  plugins: [react()],
  base: '/factoryflow/',
})