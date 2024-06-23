import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@views/Login.vue'
import LabHome from '../views/LabHome.vue'
import StudentTask from '../views/studentTask.vue'
import store from '../store/index'
import localCache from '@/utils/localCache'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/labhome',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/studentTask',
    name: 'studentTask',
    component: StudentTask,
  },
  {
    path: '/flvPlay',
    name: 'FlvPlay',
    component: () => import('@/views/flv-play.vue'),
  },
]
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// 路由跳转之前
router.beforeEach((to, from, next) => {
  if (
    to.name !== 'studentTask' &&
    to.name !== 'FlvPlay' &&
    !localCache.getCookie('swr_token')
  ) {
    Message({
      type: 'warning',
      message: '请先登录,三秒后跳转登录页',
    })
    setTimeout(() => {
      window.location.href = process.env.VUE_APP_APP_LOGINURL
    }, 3000)
    next(false)
  }

  if (!store.state.hasPermission && localCache.getCookie('swr_token')) {
    return store.dispatch('FETCH_PERMISSION').then(() => {
      next({ ...to, replace: true })
    })
  } else {
    next()
  }
})

router.afterEach((to) => {
  try {
    // 设置标题
    if (to.meta.title) {
      document.title = to.meta.title
    }
  } catch (err) {
    console.log()
  }
})

export const DynamicRoutes = [
  {
    path: '/labhome',
    name: 'labhome',
    component: LabHome,
    // redirect: 'experimentPlan',
    children: [],
  },
]

export default router
