import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  server: {
    host: true, // <-- Tambahkan baris ini agar Vite menerima akses dari IP lokal/HP
    port: 5173,  // Opsional, memastikan port tetap 5173
    allowedHosts: true
  }
})