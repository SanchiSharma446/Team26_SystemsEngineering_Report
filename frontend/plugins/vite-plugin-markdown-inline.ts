import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

export function markdownInlinePlugin(): Plugin {
  const virtualModuleId = 'virtual:markdown-content'
  const resolvedId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-markdown-inline',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) {
        const docsDir = path.resolve(__dirname, '../public/docs')
        const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'))
        const entries: Record<string, string> = {}
        for (const file of files) {
          entries[`/docs/${file}`] = fs.readFileSync(path.join(docsDir, file), 'utf-8')
        }
        return `export default ${JSON.stringify(entries)}`
      }
    },
  }
}
