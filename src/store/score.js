// =====================================================
// 状态管理 + 匹配算法 — 归一化权重版
// =====================================================
// 维度说明：
//   sweet      甜度
//   sour       酸度
//   strong     烈度
//   bitter     苦度
//   fruity     果味
//   herbal     草本/辛香
//   creamy     奶香/creamy
//   refreshing 清爽度
//
// 匹配算法：归一化余弦相似度
//   先将每款酒的 8 维权重归一化到单位向量（L2 norm = 1），
//   再与用户的 8 维得分向量计算余弦相似度。
//   归一化解决了部分酒（如 Zombie）权重覆盖范围过广、
//   导致无论用户偏好如何都高匹配的问题。
// =====================================================

import { reactive } from 'vue'

const DIMENSIONS = ['sweet', 'sour', 'strong', 'bitter', 'fruity', 'herbal', 'creamy', 'refreshing']

const state = reactive({
  currentIndex: 0,     // 当前题号
  scores: {
    sweet: 0,
    sour: 0,
    strong: 0,
    bitter: 0,
    fruity: 0,
    herbal: 0,
    creamy: 0,
    refreshing: 0,
  },
  finalResult: null,   // 最终匹配结果 { drink, percentage, top3 }
  answered: false,     // 是否已完成答题
})

export function useStore() {
  function answerQuestion(dimScores) {
    for (const dim of DIMENSIONS) {
      if (dimScores[dim]) {
        state.scores[dim] += dimScores[dim]
      }
    }
    state.currentIndex++
  }

  function goBack() {
    if (state.currentIndex > 0) {
      state.currentIndex--
    }
  }

  /**
   * 计算匹配结果 — 归一化余弦相似度
   * 对每款酒：将权重向量归一化为单位长度，再与用户得分计算余弦相似度
   * 返回 { drink, percentage, top3 }
   */
  function computeResult(drinks) {
    if (!drinks || drinks.length === 0) return null

    // 预先归一化所有酒的权重向量
    const normalized = drinks.map(drink => {
      let mag2 = 0
      for (const dim of DIMENSIONS) {
        const v = drink.weights[dim] || 0
        mag2 += v * v
      }
      const mag = Math.sqrt(mag2)
      const nw = {}
      if (mag > 0) {
        for (const dim of DIMENSIONS) {
          nw[dim] = (drink.weights[dim] || 0) / mag
        }
      } else {
        for (const dim of DIMENSIONS) {
          nw[dim] = 0
        }
      }
      return { drink, nw }
    })

    // 计算用户得分向量模
    let scoreMag2 = 0
    for (const dim of DIMENSIONS) {
      scoreMag2 += state.scores[dim] * state.scores[dim]
    }
    const scoreMag = Math.sqrt(scoreMag2)

    const results = []
    for (const { drink, nw } of normalized) {
      if (scoreMag === 0) {
        // 用户没有明显偏好，给中立分数
        results.push({ drink, percentage: 50 })
        continue
      }
      let dot = 0
      for (const dim of DIMENSIONS) {
        dot += state.scores[dim] * nw[dim]
      }
      const cosSim = dot / scoreMag  // nw 已是单位长度
      const percentage = Math.round(Math.max(0, Math.min(100, (cosSim + 1) * 50)))
      results.push({ drink, percentage })
    }

    // 按匹配度降序排列
    results.sort((a, b) => b.percentage - a.percentage)

    return {
      drink: results[0].drink,
      percentage: results[0].percentage,
      top3: results.slice(0, 3),
    }
  }

  function finalizeResult(drinks) {
    state.finalResult = computeResult(drinks)
    state.answered = true
  }

  function reset() {
    state.currentIndex = 0
    for (const dim of DIMENSIONS) {
      state.scores[dim] = 0
    }
    state.finalResult = null
    state.answered = false
  }

  return { state, answerQuestion, goBack, computeResult, finalizeResult, reset }
}
