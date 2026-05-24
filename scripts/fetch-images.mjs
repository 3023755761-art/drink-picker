// =====================================================
// 批量抓取 IBA 鸡尾酒图片 URL
// 用法：node scripts/fetch-images.mjs
// =====================================================

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRINKS_PATH = resolve(__dirname, '..', 'src', 'data', 'drinks.js')

// 从 drinks.js 提取所有 cocktail id + category
function extractCocktails() {
  const content = readFileSync(DRINKS_PATH, 'utf-8')
  const cocktails = []
  // 匹配每个 cocktail 对象
  const regex = /\{\s*id:\s*"([^"]+)",\s*name:\s*"[^"]+",\s*category:\s*"([^"]+)"/g
  let match
  while ((match = regex.exec(content)) !== null) {
    cocktails.push({ id: match[1], category: match[2] })
  }
  return cocktails
}

// 分类 → URL中的分类名
function categoryToUrlSlug(cat) {
  const map = {
    'The Unforgettables': 'the-unforgettables',
    'Contemporary Classics': 'contemporary-classics',
    'New Era Drinks': 'new-era',
  }
  return map[cat] || 'the-unforgettables'
}

// 抓取单个页面，提取图片 hash
async function fetchImageHash(id, cat) {
  const url = `https://iba-world.com/iba-cocktail/${id}/`
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!resp.ok) {
      console.log(`  [${resp.status}] ${id}`)
      return null
    }
    const html = await resp.text()

    // 匹配 IBA 鸡尾酒 featured image
    const imgRegex = new RegExp(
      `https://iba-world\\.com/wp-content/uploads/\\d{4}/\\d{2}/iba-cocktail-[^"]+\\.webp`,
      'i'
    )
    const match = html.match(imgRegex)
    if (!match) {
      console.log(`  [!] no image found: ${id}`)
      return null
    }
    // 提取 hash：最后一个 - 和 .webp 之间的部分
    const urlPart = match[0]
    const hashMatch = urlPart.match(/-([a-f0-9]+)\.webp$/i)
    if (!hashMatch) {
      console.log(`  [!] no hash in URL: ${id} → ${urlPart}`)
      return null
    }
    return hashMatch[1]
  } catch (err) {
    console.log(`  [err] ${id}: ${err.message}`)
    return null
  }
}

// 批量抓取（控制并发数）
async function fetchAll(cocktails, concurrency = 5) {
  const results = {}
  let done = 0
  const total = cocktails.length

  for (let i = 0; i < cocktails.length; i += concurrency) {
    const batch = cocktails.slice(i, i + concurrency)
    const promises = batch.map(async (c) => {
      const hash = await fetchImageHash(c.id, c.category)
      results[c.id] = hash
      done++
      const status = hash ? 'OK' : 'MISS'
      process.stdout.write(`\r  [${done}/${total}] ${c.id}: ${status}     `)
    })
    await Promise.all(promises)
    // 批次间小休息
    await new Promise(r => setTimeout(r, 300))
  }
  console.log('') // newline
  return results
}

// 更新 drinks.js 中的 CONFIRMED_HASHES
function updateDrinksFile(hashMap) {
  let content = readFileSync(DRINKS_PATH, 'utf-8')

  // 生成新的 CONFIRMED_HASHES
  const lines = []
  const cats = ['The Unforgettables', 'Contemporary Classics', 'New Era Drinks']
  for (const cat of cats) {
    lines.push(`  // === ${cat} ===`)
    const catSlug = categoryToUrlSlug(cat)
    for (const [id, hash] of Object.entries(hashMap)) {
      if (hash) {
        lines.push(`  '${id}':`.padEnd(24) + `'${catSlug}-${id}-${hash}',`)
      }
    }
  }

  // 简单方案：直接替换整个 CONFIRMED_HASHES 块
  const hashRegex = /const CONFIRMED_HASHES = \{[\s\S]*?\}/
  const newHashes = 'const CONFIRMED_HASHES = {\n' + lines.join('\n') + '\n}'
  content = content.replace(hashRegex, newHashes)

  writeFileSync(DRINKS_PATH, content, 'utf-8')
  console.log(`✅ 已更新 drinks.js（${lines.length} 款酒的图片 hash）`)
}

// ===== main =====
async function main() {
  console.log('🔍 提取鸡尾酒列表...')
  const cocktails = extractCocktails()
  console.log(`  找到 ${cocktails.length} 款鸡尾酒\n`)

  console.log('🌐 开始抓取图片...')
  const hashMap = await fetchAll(cocktails, 5)

  const found = Object.values(hashMap).filter(Boolean).length
  const missing = cocktails.length - found
  console.log(`\n📊 结果：${found} 成功, ${missing} 缺失`)

  if (missing > 0) {
    console.log('  缺失列表：')
    for (const [id, hash] of Object.entries(hashMap)) {
      if (!hash) console.log(`    - ${id}`)
    }
  }

  // 更新文件
  updateDrinksFile(hashMap)
  console.log('\n✨ 完成！')
}

main().catch(console.error)
