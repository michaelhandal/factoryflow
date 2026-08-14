import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Explicitly binds to all network interfaces inside Codespaces
    port: 5173,
    strictPort: true,
  }
})