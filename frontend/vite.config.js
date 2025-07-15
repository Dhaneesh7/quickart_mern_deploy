import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port: 5173, // Force Vite to use this port
    strictPort: true, // Will throw an error if 5173 is in use
  },
   proxy: {
      // This proxies all requests starting with /api to your backend
      '/api': {
        // target: 'http://localhost:5000',
        target: 'https://quickart-mern-deploy.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// // https://vite.dev/config/
// export default defineConfig({
//   darkMode: 'class', 
//   plugins: [react(),tailwindcss(),],

// })


