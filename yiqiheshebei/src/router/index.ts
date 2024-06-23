import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@views/login/Login.vue'
import localCache from '@/utils/localCache'
import { ElMessage } from 'element-plus'

import { store } from '@/store/index'
// const store = useStore()

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

router.afterEach((to: any) => {
  NProgress.done() // 完成进度条
  try {
    //设置标题
    if (to.meta.title) {
      document.title = to.meta.title
    }
  } catch (err) {
    console.log()
  }
  // const routerList = to.matched
  // 顶部面包屑
  // store.commit('router/setCrumbList', routerList)
  // 目前左边导航选中的active
  // store.commit('router/SET_CURRENT_MENU', to.title)
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
