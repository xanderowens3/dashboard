import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/smartlead-api': {
        target: 'https://server.smartlead.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smartlead-api/, '/api/v1'),
      },
    },
  },
})
