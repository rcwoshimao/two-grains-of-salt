import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/three-grains-of-salt/',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'git-history': ['../data/git-history.json']
        }
      }
    }
  }
})
