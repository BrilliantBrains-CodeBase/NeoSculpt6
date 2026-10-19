#!/usr/bin/env node
// Most static hosts (Netlify, Cloudflare Pages, Vercel) serve /404.html for unknown URLs.
import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve(import.meta.dirname, '../dist')
const src = path.join(dist, '404/index.html')
if (fs.existsSync(src)) {
  fs.copyFileSync(src, path.join(dist, '404.html'))
  console.log('postbuild: dist/404.html written')
} else {
  console.warn('postbuild: dist/404/index.html not found')
}
