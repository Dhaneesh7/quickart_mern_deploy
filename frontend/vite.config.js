import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React project with dev proxy
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://quickart-mern-deploy.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')  // Strip the /api prefix before proxying
      }
    }
  }
})
