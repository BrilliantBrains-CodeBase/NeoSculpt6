import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssgOptions: {
    // `/foo/` -> `dist/foo/index.html`, so the old WordPress trailing-slash URLs resolve unchanged.
    dirStyle: 'nested',
    entry: 'src/main.tsx',
    beastiesOptions: false,
  },
})
