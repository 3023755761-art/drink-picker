// 简化修复：将 CONFIRMED_HASHES 的值改为纯 hash
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRINKS_PATH = resolve(__dirname, '..', 'src', 'data', 'drinks.js')

let content = readFileSync(DRINKS_PATH, 'utf-8')

// 找到 CONFIRMED_HASHES 块的起止位置
const start = content.indexOf('const CONFIRMED_HASHES = {')
const end = content.indexOf('\n}', start) + 2
const block = content.slice(start, end)

// 提取每行，提取纯 hash（最后一个 - 后的 hex 串）
const lines = block.split('\n')
const newLines = [lines[0]] // const CONFIRMED_HASHES = {
for (let i = 1; i < lines.length - 1; i++) {
  const line = lines[i]
  const m = line.match(/^(\s*'[^']+':\s*)'[^']*-([a-f0-9]+)',/)
  if (m) {
    newLines.push(`${m[1]}'${m[2]}',`)
  } else if (line.trim()) {
    newLines.push(line)
  }
}
newLines.push(lines[lines.length - 1]) // }

const newBlock = newLines.join('\n')
content = content.replace(block, newBlock)

writeFileSync(DRINKS_PATH, content, 'utf-8')
console.log('✅ Done - CONFIRMED_HASHES values are now pure hashes')
