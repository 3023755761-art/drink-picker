import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Quiz from '../views/Quiz.vue'
import Result from '../views/Result.vue'
import DrinkList from '../views/DrinkList.vue'

const routes = [
  { path: '/',           component: Home      },
  { path: '/quiz',       component: Quiz      },
  { path: '/result',     component: Result    },
  { path: '/drink-list', component: DrinkList },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
