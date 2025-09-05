import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'recharts'],
          services: ['@supabase/supabase-js', '@stripe/stripe-js', 'openai'],
          utils: ['date-fns', 'react-hook-form', 'react-hot-toast', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
