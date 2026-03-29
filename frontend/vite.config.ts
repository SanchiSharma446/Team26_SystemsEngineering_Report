import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'markdown-content-stub',
      resolveId(id) {
        if (id === 'virtual:markdown-content') return '\0virtual:markdown-content'
      },
      load(id) {
        if (id === '\0virtual:markdown-content') return 'export default {}'
      },
    },
  ],
  base: '/2025/group26/',
})
