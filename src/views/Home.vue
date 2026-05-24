<template>
  <div class="home">
    <!-- 右上角：酒类大全按钮 -->
    <button class="list-btn" @click="router.push('/drink-list')">酒类大全 →</button>

    <div class="hero">
      <div class="emoji">🍸</div>
      <h1>今天想喝点什么？</h1>
      <p class="subtitle">几道小题，帮你找到今晚最适合的那一杯</p>
      <button class="start-btn" @click="start">开始测试</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from '../store/score.js'

const router = useRouter()
const { reset } = useStore()

function start() {
  reset()
  router.push('/quiz')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 右上角按钮 */
.list-btn {
  position: absolute;
  top: 1.4rem;
  right: 1.4rem;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
  border: 1.5px solid #7c5cbf;
  border-radius: 50px;
  background: transparent;
  color: #7c5cbf;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.list-btn:hover {
  background: #7c5cbf;
  color: #fff;
}

.hero {
  text-align: center;
  padding: 2rem;
}

.emoji {
  font-size: 80px;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #2c2c2a;
}

.subtitle {
  font-size: 1rem;
  color: #888;
  margin-bottom: 2rem;
}

.start-btn {
  padding: 0.9rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  border-radius: 50px;
  background: #7c5cbf;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.start-btn:hover {
  background: #6347a8;
}
</style>
