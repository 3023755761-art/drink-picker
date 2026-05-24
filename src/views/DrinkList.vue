<template>
  <div class="drink-list">
    <header class="header">
      <button class="back-btn" @click="router.push('/')">← 返回首页</button>
      <h1>IBA 经典鸡尾酒大全</h1>
      <p class="subtitle">国际调酒师协会官方收录 · 共 {{ drinks.length }} 款</p>

      <!-- 搜索框 -->
      <div class="search-wrap">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索鸡尾酒名称、原料…（支持模糊匹配）"
          autocomplete="off"
        />
        <span class="search-clear" v-if="searchQuery" @click="searchQuery = ''">✕</span>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-bar">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="filter-btn"
          :class="{ active: activeCat === cat.key }"
          @click="activeCat = cat.key"
        >{{ cat.label }} ({{ cat.count }})</button>
      </div>

      <!-- 搜索结果提示 -->
      <p class="search-hint" v-if="searchQuery">
        找到 {{ filteredDrinks.length }} 款匹配「{{ searchQuery }}」
      </p>
    </header>

    <!-- 鸡尾酒列表 -->
    <div class="cocktail-grid">
      <div
        v-for="d in filteredDrinks"
        :key="d.id"
        class="cocktail-card"
        :class="{ expanded: expandedId === d.id }"
      >
        <div class="card-main" @click="toggle(d.id)">
          <div class="card-img-wrap">
            <img :src="d.image" :alt="d.name" class="card-img" @error="onImgError" />
            <div class="card-img-fallback" v-if="imgErrors[d.id]">🍸</div>
          </div>
          <div class="card-info">
            <span class="card-category">{{ d.category }}</span>
            <h3 class="card-name">{{ d.name }}</h3>
            <p class="card-desc">{{ d.desc }}</p>
          </div>
          <span class="expand-icon">{{ expandedId === d.id ? '▲' : '▼' }}</span>
        </div>

        <!-- 展开：调制方法 -->
        <div class="card-detail" v-if="expandedId === d.id">
          <div class="meta-line">🥂 杯型：{{ d.glass }} | ✨ 装饰：{{ d.garnish || '无' }}</div>

          <h4 class="detail-title">🧪 原料</h4>
          <ul class="ingredient-list">
            <li v-for="(r, i) in d.recipe" :key="i">
              <span>{{ r.item }}</span><span class="amount">{{ r.amount }}</span>
            </li>
          </ul>

          <h4 class="detail-title">📋 调制步骤</h4>
          <ol class="steps-list">
            <li v-for="(s, i) in d.steps" :key="i">{{ s }}</li>
          </ol>

          <!-- 维度雷达 -->
          <h4 class="detail-title">📊 口味画像</h4>
          <div class="dim-mini" v-for="dim in dims" :key="dim.key">
            <span class="dim-mini-label">{{ dim.label }}</span>
            <div class="dim-mini-track">
              <div class="dim-mini-fill" :style="{ width: ((d.weights[dim.key] || 0) / 5 * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="iba-credit">数据来源：iba-world.com · IBA 国际调酒师协会</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { drinks, CATEGORIES } from '../data/drinks.js'

const router = useRouter()
const expandedId = ref(null)
const activeCat = ref('all')
const searchQuery = ref('')
const imgErrors = ref({})

const DIM_LABELS = {
  sweet: '甜', sour: '酸', strong: '烈', bitter: '苦',
  fruity: '果', herbal: '草', creamy: '奶', refreshing: '爽',
}
const dims = Object.entries(DIM_LABELS).map(([key, label]) => ({ key, label }))

const categories = computed(() => {
  const counts = { all: drinks.length }
  for (const cat of CATEGORIES) {
    counts[cat] = drinks.filter(d => d.category === cat).length
  }
  return [
    { key: 'all', label: '全部', count: counts.all },
    ...CATEGORIES.map(c => ({ key: c, label: c, count: counts[c] })),
  ]
})

const filteredDrinks = computed(() => {
  let list = activeCat.value === 'all' ? drinks : drinks.filter(d => d.category === activeCat.value)

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(d => {
      // 名称匹配（中文 + 英文 id）
      if (d.name.toLowerCase().includes(q)) return true
      if (d.id.toLowerCase().replace(/-/g, ' ').includes(q)) return true
      // 描述
      if (d.desc.toLowerCase().includes(q)) return true
      // 分类
      if (d.category.toLowerCase().includes(q)) return true
      // 原料
      const ingredients = d.recipe.map(r => r.item.toLowerCase()).join(' ')
      if (ingredients.includes(q)) return true
      return false
    })
  }

  return list
})

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function onImgError(e) {
  imgErrors.value[e.target.alt || Math.random()] = true
  e.target.style.display = 'none'
}
</script>

<style scoped>
.drink-list {
  min-height: 100vh;
  padding: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.45rem 1rem;
  border: 1px solid #ddd;
  border-radius: 50px;
  background: transparent;
  color: #888;
  cursor: pointer;
  font-size: 0.85rem;
}

.back-btn:hover { border-color: #7c5cbf; color: #7c5cbf; }

h1 { font-size: 1.6rem; font-weight: 700; color: #2c2c2a; margin-bottom: 0.3rem; }
.subtitle { font-size: 0.9rem; color: #999; }

/* 搜索框 */
.search-wrap {
  position: relative;
  max-width: 420px;
  margin: 1.2rem auto 0;
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.4rem 0.6rem 1rem;
  font-size: 0.9rem;
  border: 1.5px solid #ddd;
  border-radius: 50px;
  background: #fff;
  color: #2c2c2a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder { color: #bbb; }
.search-input:focus {
  border-color: #7c5cbf;
  box-shadow: 0 0 0 3px rgba(124, 92, 191, 0.1);
}

.search-clear {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  color: #aaa;
  cursor: pointer;
  line-height: 1;
}
.search-clear:hover { color: #7c5cbf; }

.search-hint {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #7c5cbf;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.35rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 50px;
  background: #fff;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active,
.filter-btn:hover {
  background: #7c5cbf;
  color: #fff;
  border-color: #7c5cbf;
}

/* 卡片网格 */
.cocktail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.cocktail-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.cocktail-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

.card-main {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.8rem;
  cursor: pointer;
}

.card-img-wrap {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f3fa;
  position: relative;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.card-info { flex: 1; min-width: 0; }

.card-category {
  font-size: 0.7rem;
  color: #7c5cbf;
  letter-spacing: 0.04em;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c2c2a;
  margin: 0.15rem 0;
}

.card-desc {
  font-size: 0.8rem;
  color: #999;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expand-icon {
  font-size: 0.7rem;
  color: #ccc;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

/* 展开详情 */
.card-detail {
  padding: 0 0.8rem 1rem;
  border-top: 1px solid #f0edf7;
}

.meta-line {
  font-size: 0.78rem;
  color: #999;
  margin: 0.8rem 0 0.6rem;
}

.detail-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #5a3fa0;
  margin: 0.8rem 0 0.4rem;
}

.ingredient-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 0.2rem 0;
  color: #555;
}

.amount { color: #7c5cbf; font-weight: 500; }

.steps-list {
  padding-left: 1rem;
  margin: 0;
}

.steps-list li {
  font-size: 0.78rem;
  color: #666;
  line-height: 1.6;
}

/* 口味微条 */
.dim-mini {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.2rem;
}

.dim-mini-label {
  width: 20px;
  font-size: 0.7rem;
  color: #aaa;
  text-align: right;
}

.dim-mini-track {
  flex: 1;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
}

.dim-mini-fill {
  height: 100%;
  background: #7c5cbf;
  border-radius: 2px;
}

.iba-credit {
  text-align: center;
  font-size: 0.75rem;
  color: #ccc;
  margin-top: 2.5rem;
}
</style>
