import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/login/Login.vue'

import localCache from '@/utils/localCache'
import { store } from '@/store/index'
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由跳转之前
router.beforeEach((to, from, next) => {
  NProgress.start() // 显示进度条

  // 未登录
  // if (to.name !== 'Login' && !localCache.getCookie('swr_token')) {
  //   next({ name: 'Login' })
  // }
  if (!localCache.getCookie('swr_token')) {
    ElMessage({
      type: 'warning',
      message: '请先登录,三秒后跳转登录页'
    })
    setTimeout(() => {
      window.location.href = process.env.VUE_APP_APP_LOGINURL as string
    }, 3000)
  }

  if (!store.state.router.hasPermission && localCache.getCookie('swr_token')) {
    return store.dispatch('router/FETCH_PERMISSION').then(() => {
      next({ ...to, replace: true })
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // 完成进度条
})

export const DynamicRoutes = [
  {
    path: '/index',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@views/index.vue'),
    // redirect: { name: 'LaboratoryStandard' },
    children: []
  }
]
export default router
