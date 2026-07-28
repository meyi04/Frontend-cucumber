import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Allows external connections
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost'  // For hot reload to work
    }
  }
})