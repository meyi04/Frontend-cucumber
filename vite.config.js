import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',  // Allows external connections
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1'  // For hot reload to work
    }
  }
})