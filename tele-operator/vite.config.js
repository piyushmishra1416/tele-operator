import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allows LAN access
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'], // Allow Cloudflare tunnels
  },
})
