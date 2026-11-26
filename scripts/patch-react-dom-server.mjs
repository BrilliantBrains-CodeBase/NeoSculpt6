#!/usr/bin/env node
// Fixes a prerender bug in react-dom 18.3.1's streaming renderer (react-dom/server.node, used by vite-react-ssg).
// writeStringChunk encodes text into a 2048-byte view; when a string does not fit, it flushes the *whole* view
// (`writeToDestination(destination, currentView)`) instead of the bytes it wrote (`currentView.subarray(0,
// writtenBytes)`). The 1–2 unused bytes at the end go into the HTML: on Node 26 they hold part of the character that
// did not fit, so "patient’s" came out as "patient�’s" (seen on the HIFU and Q-Switch pages). Which page it hits
// depends on byte offsets, so any content change can move it. React's own fix: flush `subarray(0, writtenBytes)`.
//
//   node scripts/patch-react-dom-server.mjs     # run by `npm run build` and `postinstall`; safe to run again
//
// It edits node_modules only (the development and production builds), and fails loudly if React's code no longer
// matches: a newer react-dom may not need it (check, then drop this script). `npm run verify` fails on any U+FFFD
// in dist/, whatever the cause.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const CJS = path.join(ROOT, 'node_modules/react-dom/cjs')

// [file, the buggy flush, the fixed one]. Each must match exactly once.
const FIXES = [
  [
    'react-dom-server.node.development.js',
    '  if (read < stringChunk.length) {\n    writeToDestination(destination, currentView);\n',
    '  if (read < stringChunk.length) {\n    writeToDestination(destination, currentView.subarray(0, writtenBytes));\n',
  ],
  ['react-dom-server.node.production.min.js', 'd<b.length&&(t(a,k),k=new Uint8Array(2048)', 'd<b.length&&(t(a,k.subarray(0,l)),k=new Uint8Array(2048)'],
]

if (!fs.existsSync(CJS)) {
  console.log('patch-react-dom-server: react-dom not installed, nothing to patch')
  process.exit(0)
}
for (const [name, from, to] of FIXES) {
  const file = path.join(CJS, name)
  const src = fs.readFileSync(file, 'utf8')
  if (src.includes(to)) {
    console.log(`patch-react-dom-server: ${name} already patched`)
    continue
  }
  if (src.split(from).length !== 2) throw new Error(`patch-react-dom-server: the flush to fix was not found exactly once in ${name}`)
  fs.writeFileSync(file, src.replace(from, to))
  console.log(`patch-react-dom-server: patched ${name}`)
}
