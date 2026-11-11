import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const violations = []

async function walk(directory) {
  let entries
  try { entries = await readdir(directory, { withFileTypes: true }) } catch { return }
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(target)
    else {
      if (/\.svg$/i.test(entry.name)) violations.push(`${path.relative(root, target)} (SVG file)`)
      if (/\.(jsx?|css|html)$/i.test(entry.name)) {
        const source = await readFile(target, 'utf8')
        if (/<\s*svg\b|\.svg\b|image\/svg\+xml/i.test(source)) violations.push(`${path.relative(root, target)} (SVG reference)`)
      }
    }
  }
}

for (const directory of ['src', 'public']) await walk(path.join(root, directory))
const html = await readFile(path.join(root, 'index.html'), 'utf8')
if (/<\s*svg\b|\.svg\b|image\/svg\+xml/i.test(html)) violations.push('index.html (SVG reference)')
if (violations.length) {
  console.error(`SVG content found:\n${violations.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}
console.log('No SVG files or references found in src/, public/, or index.html.')
