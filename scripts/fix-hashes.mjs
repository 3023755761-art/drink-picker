// =====================================================
// 修复 drinks.js — 将 CONFIRMED_HASHES 改为 id→hash 映射
// 用法：node scripts/fix-hashes.mjs
// =====================================================

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRINKS_PATH = resolve(__dirname, '..', 'src', 'data', 'drinks.js')

let content = readFileSync(DRINKS_PATH, 'utf-8')

// 方案：从现有的 CONFIRMED_HASHES 值中提取纯 hash
// 值格式：'{cat}-{id}-{hash}'，取最后一个 - 后面的部分
function extractHash(value) {
  const match = value.match(/-([a-f0-9]+)'/)
  return match ? match[1] : value
}

// 解析当前 CONFIRMED_HASHES 块，转为 id→pure_hash
const hashBlock = content.match(/const CONFIRMED_HASHES = \{([\s\S]*?)\}/)
if (!hashBlock) { console.log('未找到 CONFIRMED_HASHES'); process.exit(1) }

const entries = []
const lineRegex = /'([^']+)'\s*:\s*'([^']+)'/g
let m
while ((m = lineRegex.exec(hashBlock[1])) !== null) {
  const id = m[1]
  const hash = extractHash(m[2])
  // 去重
  if (!entries.find(e => e[0] === id)) {
    entries.push([id, hash])
  }
}

console.log(`解析出 ${entries.length} 个唯一 hash`)

// 生成新的 CONFIRMED_HASHES（按分类分组）
const newBlock = `const CONFIRMED_HASHES = {
${entries.map(([id, h]) => `  '${id}':`.padEnd(24) + `'${h}',`).join('\n')}
}`

content = content.replace(/const CONFIRMED_HASHES = \{[\s\S]*?\}/, newBlock)

// 同时修改 imageUrl 函数，使用 cocktail.category 拼接
const oldImageUrl = `function imageUrl(cocktail) {
  const key = cocktail.id
  if (CONFIRMED_HASHES[key]) {
    return \`\${IBA_IMAGE_BASE}/iba-cocktail-\${CONFIRMED_HASHES[key]}.webp\`
  }
  // 未确认hash的鸡尾酒，使用占位符 — 运行 scripts/fetch-iba-images.mjs 可批量获取
  const cat = CATEGORY_SLUG[cocktail.category] || 'the-unforgettables'
  return \`\${IBA_IMAGE_BASE}/iba-cocktail-\${cat}-\${key}-PLACEHOLDER.webp\`
}`

const newImageUrl = `function imageUrl(cocktail) {
  const key = cocktail.id
  const cat = CATEGORY_SLUG[cocktail.category] || 'the-unforgettables'
  if (CONFIRMED_HASHES[key]) {
    return \`\${IBA_IMAGE_BASE}/iba-cocktail-\${cat}-\${key}-\${CONFIRMED_HASHES[key]}.webp\`
  }
  // 未确认hash的鸡尾酒 — 运行 scripts/fetch-images.mjs 可批量获取
  return \`\${IBA_IMAGE_BASE}/iba-cocktail-\${cat}-\${key}-PLACEHOLDER.webp\`
}`

content = content.replace(oldImageUrl, newImageUrl)

writeFileSync(DRINKS_PATH, content, 'utf-8')
console.log('✅ 已修复 drinks.js')
