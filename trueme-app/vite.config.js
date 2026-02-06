import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // If there are other services exposed directly or via gateway not covered
      '/products': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/payments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
