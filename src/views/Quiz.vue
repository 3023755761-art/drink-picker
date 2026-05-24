<template>
  <div class="quiz">
    <!-- 进度条 -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- 题目区域 -->
    <div class="question-area" v-if="currentQuestion">
      <div class="question-meta">
        {{ store.state.currentIndex + 1 }} / {{ total }}
      </div>
      <h2 class="question-text">{{ currentQuestion.text }}</h2>

      <!-- 选项列表 -->
      <div class="options">
        <button
          v-for="(opt, i) in currentQuestion.options"
          :key="i"
          class="option-btn"
          :class="{ selected: selectedIndex === i }"
          @click="select(i)"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- 只保留返回键 -->
      <div class="nav-btns">
        <button class="back-btn" @click="back" :disabled="store.state.currentIndex === 0">
          ← 上一题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { questions } from '../data/questions.js'
import { drinks } from '../data/drinks.js'
import { useStore } from '../store/score.js'

const router = useRouter()
const store = useStore()
const { answerQuestion, goBack, finalizeResult } = store

const selectedIndex = ref(null)
const total = questions.length

const currentQuestion = computed(() => questions[store.state.currentIndex])
const isLast = computed(() => store.state.currentIndex === total - 1)
const progressPercent = computed(() =>
  ((store.state.currentIndex) / total) * 100
)

function select(i) {
  selectedIndex.value = i
  // 短暂延迟让选中效果闪一下，再跳题，体验更好
  setTimeout(() => {
    next()
  }, 180)
}

function next() {
  if (selectedIndex.value === null) return
  const scores = currentQuestion.value.options[selectedIndex.value].scores
  const last = isLast.value
  answerQuestion(scores)
  selectedIndex.value = null

  if (last || store.state.currentIndex >= total) {
    finalizeResult(drinks)
    router.push('/result')
  }
}

function back() {
  goBack()
  selectedIndex.value = null
}
</script>

<style scoped>
.quiz {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #eee;
}

.progress-fill {
  height: 100%;
  background: #7c5cbf;
  transition: width 0.3s;
}

.question-area {
  max-width: 560px;
  margin: 4rem auto 0;
  width: 100%;
}

.question-meta {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 0.8rem;
}

.question-text {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c2c2a;
  margin-bottom: 1.8rem;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.option-btn {
  padding: 1rem 1.2rem;
  border: 1.5px solid #ddd;
  border-radius: 12px;
  background: #fff;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.option-btn:hover {
  border-color: #7c5cbf;
  background: #f5f0ff;
}

.option-btn.selected {
  border-color: #7c5cbf;
  background: #ede8fa;
  font-weight: 500;
}

.nav-btns {
  display: flex;
}

.back-btn {
  padding: 0.7rem 1.4rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: transparent;
  color: #888;
  cursor: pointer;
}

.back-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
