import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { markdownInlinePlugin } from './plugins/vite-plugin-markdown-inline'

export default defineConfig({
  plugins: [
    react(),
    markdownInlinePlugin(),
    viteSingleFile(),
  ],
  base: './',
  build: {
    outDir: 'dist-static',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
