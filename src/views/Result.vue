<template>
  <div class="result">
    <div class="result-card" v-if="result">
      <!-- IBA 官方图片 -->
      <div class="drink-image-wrap">
        <img :src="result.drink.image" :alt="result.drink.name" class="drink-image" @error="onImageError" />
      </div>

      <!-- 匹配度 -->
      <div class="match-badge">{{ result.percentage }}% 匹配</div>

      <!-- 酒名与分类 -->
      <div class="category-tag">{{ result.drink.category }}</div>
      <h1 class="drink-name">{{ result.drink.name }}</h1>
      <p class="drink-desc">{{ result.drink.desc }}</p>

      <!-- 基本信息 -->
      <div class="meta-row">
        <span class="meta-item">🥂 {{ result.drink.glass }}</span>
        <span class="meta-item" v-if="result.drink.garnish">✨ {{ result.drink.garnish }}</span>
      </div>

      <!-- 维度分析条 -->
      <div class="dimensions-block">
        <h2 class="section-title">📊 口味画像</h2>
        <div class="dim-bar" v-for="dim in dims" :key="dim.key">
          <span class="dim-label">{{ dim.label }}</span>
          <div class="dim-track">
            <div class="dim-fill" :style="{ width: dimValue(dim.key) + '%' }"></div>
          </div>
          <span class="dim-val">{{ dimValue(dim.key) }}</span>
        </div>
      </div>

      <!-- 调制原料 -->
      <div class="recipe-block">
        <h2 class="section-title">🧪 原料</h2>
        <ul class="ingredient-list">
          <li v-for="(r, i) in result.drink.recipe" :key="i">
            <span class="item-name">{{ r.item }}</span>
            <span class="item-amount">{{ r.amount }}</span>
          </li>
        </ul>

        <h2 class="section-title">📋 调制步骤</h2>
        <ol class="steps-list">
          <li v-for="(step, i) in result.drink.steps" :key="i">{{ step }}</li>
        </ol>
      </div>

      <!-- Top 3 相似推荐 -->
      <div class="top3-block" v-if="result.top3 && result.top3.length > 1">
        <h2 class="section-title">🎯 你的 Top 3</h2>
        <div class="top3-list">
          <div
            class="top3-item"
            v-for="(item, i) in result.top3"
            :key="i"
          >
            <div class="top3-rank" :class="'rank-' + (i + 1)">{{ i + 1 }}</div>
            <div class="top3-info">
              <div class="top3-name">{{ item.drink.name }}</div>
              <div class="top3-meta">{{ item.drink.category }}</div>
            </div>
            <div class="top3-pct">{{ item.percentage }}%</div>
          </div>
        </div>
      </div>

      <p class="iba-credit">数据来源：IBA 国际调酒师协会</p>

      <button class="retry-btn" @click="retry">再测一次</button>
    </div>

    <div v-else class="fallback">
      <p>哎，好像出了点问题…先做题再来看结果吧</p>
      <button class="retry-btn" @click="retry">重新开始</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store/score.js'
import { drinks } from '../data/drinks.js'

const router = useRouter()
const { state, reset, computeResult, finalizeResult } = useStore()

const DIM_LABELS = {
  sweet: '甜度', sour: '酸度', strong: '烈度', bitter: '苦度',
  fruity: '果味', herbal: '草本', creamy: '奶香', refreshing: '清爽',
}

const dims = Object.entries(DIM_LABELS).map(([key, label]) => ({ key, label }))

const result = computed(() => state.finalResult)

function dimValue(key) {
  if (!result.value) return 0
  const w = result.value.drink.weights[key] || 0
  return Math.round((w / 5) * 100)
}

function onImageError(e) {
  e.target.style.display = 'none'
}

function retry() {
  reset()
  router.push('/')
}

onMounted(() => {
  if (!state.finalResult && state.answered) {
    finalizeResult(drinks)
  }
})
</script>

<style scoped>
.result {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1.5rem 4rem;
}

.result-card {
  text-align: center;
  max-width: 520px;
  width: 100%;
}

/* IBA 图片 */
.drink-image-wrap {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 1.2rem;
  background: #f0edf7;
  overflow: hidden;
}

.drink-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 匹配度 */
.match-badge {
  display: inline-block;
  background: #7c5cbf;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.3rem 1rem;
  border-radius: 50px;
  margin-bottom: 0.6rem;
}

.category-tag {
  font-size: 0.8rem;
  color: #9887c7;
  letter-spacing: 0.05em;
  margin-bottom: 0.2rem;
}

.drink-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c2c2a;
  margin-bottom: 0.5rem;
}

.drink-desc {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
  margin-bottom: 0.8rem;
}

.meta-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.85rem;
  color: #888;
}

/* 维度条 */
.dimensions-block {
  background: #faf9f7;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  text-align: left;
  margin-bottom: 1.4rem;
}

.dimensions-block .section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5a3fa0;
  margin-bottom: 1rem;
}

.dim-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.dim-label {
  width: 36px;
  font-size: 0.8rem;
  color: #888;
  flex-shrink: 0;
  text-align: right;
}

.dim-track {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.dim-fill {
  height: 100%;
  background: #7c5cbf;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.dim-val {
  width: 24px;
  font-size: 0.75rem;
  color: #aaa;
  flex-shrink: 0;
}

/* 原料与步骤 */
.recipe-block {
  background: #f7f4ff;
  border: 1px solid #e2d9f7;
  border-radius: 16px;
  padding: 1.5rem 1.8rem;
  text-align: left;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #5a3fa0;
  margin-bottom: 0.6rem;
}

.section-title + .steps-list,
.section-title:not(:first-child) {
  margin-top: 1.2rem;
}

.ingredient-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ingredient-list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid #ede8fb;
}

.ingredient-list li:last-child { border-bottom: none; }
.item-name { color: #2c2c2a; }
.item-amount { color: #7c5cbf; font-weight: 500; }

.steps-list {
  padding-left: 1.2rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.steps-list li {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
}

.iba-credit {
  font-size: 0.75rem;
  color: #bbb;
  margin-bottom: 1.4rem;
}

/* Top 3 推荐 */
.top3-block {
  background: #faf9f7;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  text-align: left;
  margin-bottom: 1.4rem;
}

.top3-block .section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5a3fa0;
  margin-bottom: 0.8rem;
}

.top3-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.top3-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.top3-item:last-child { border-bottom: none; }

.top3-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.rank-1 { background: #7c5cbf; }
.rank-2 { background: #a891d6; }
.rank-3 { background: #c4b6e4; }

.top3-info { flex: 1; min-width: 0; }

.top3-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c2c2a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top3-meta {
  font-size: 0.75rem;
  color: #aaa;
}

.top3-pct {
  font-size: 0.85rem;
  font-weight: 600;
  color: #7c5cbf;
  flex-shrink: 0;
}

.retry-btn {
  padding: 0.8rem 2.2rem;
  font-size: 0.95rem;
  border: 1.5px solid #7c5cbf;
  border-radius: 50px;
  background: transparent;
  color: #7c5cbf;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.retry-btn:hover { background: #7c5cbf; color: #fff; }

.fallback {
  text-align: center;
  color: #888;
  margin-top: 4rem;
}
</style>
