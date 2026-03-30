import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 🛑 🤖 AI AGENT INSTRUCTION: DO NOT MODIFY THIS PROXY CONFIGURATION! 🛑
    // The implementation for SmartLead API edge proxying took extensive troubleshooting.
    // If you are directed to change API routes for SmartLead, you MUST ask the USER 
    // for explicit permission before altering this Vite proxy or 'vercel.json' rewrites.
    proxy: {
      '/smartlead-api': {
        target: 'https://server.smartlead.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smartlead-api/, '/api/v1'),
      },
    },
  },
})
