import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  base: '/',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        welcome: resolve(__dirname, 'src/auth/html/welcome.html'),
        login: resolve(__dirname, 'src/auth/html/login.html'),
        register: resolve(__dirname, 'src/auth/html/register.html'),
        genderChoice: resolve(__dirname, 'src/auth/html/genderChoice.html'),
        spriteChoice: resolve(__dirname, 'src/auth/html/spriteChoice.html'),
      },
    },
  },
})