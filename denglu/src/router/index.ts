import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/login/Login.vue'
import NoticeList from '../views/login/notice-list.vue'
import localCache from '@/utils/localCache'
import { store } from '@/store/index'
import { ElMessage } from 'element-plus'
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/noticeList',
    name: 'NoticeList',
    component: NoticeList
  },
  {
    path: '/index',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue')
  },
  {
    path: '/moreData',
    name: 'MoreData',
    component: () => import('../views/more-data/index.vue'),
    meta: {
      title: '',
      isHidden: false
    },
    redirect: '/courseList',
    children: [
      {
        path: '/courseList',
        component: () => import('@/views/more-data/course-list/index.vue'),
        name: 'CourseList',
        meta: {
          title: '实验开课列表',
          isHidden: false,
          icon: 'experimental-record',
          icon_active: 'experimental-record-active'
        }
      },
      {
        path: '/generateStatisticalChartCourse',
        component: () => import('@/views/more-data/course-list/charts/index.vue'),
        name: 'GenerateStatisticalChartCourse',
        meta: {
          title: '生成统计图',
          isHidden: true,
          icon: 'data-analysis',
          icon_active: 'data-analysis-active'
        }
      },
      {
        path: '/courseInsList',
        component: () => import('@/views/more-data/course-ins-list/index.vue'),
        name: 'CourseInsList',
        meta: {
          title: '教学仪器设备列表',
          isHidden: false,
          icon: 'instrument',
          icon_active: 'instrument-active'
        }
      },
      {
        path: '/generateStatisticalChartCourseIns',
        component: () => import('@/views/more-data/course-ins-list/charts/index.vue'),
        name: 'GenerateStatisticalChartCourseIns',
        meta: {
          title: '生成统计图',
          isHidden: true,
          icon: 'data-analysis',
          icon_active: 'data-analysis-active'
        }
      },
      {
        path: '/roomList',
        component: () => import('@/views/more-data/room-list/index.vue'),
        name: 'RoomList',
        meta: {
          title: '功能室列表',
          isHidden: false,
          icon: 'function-room',
          icon_active: 'function-room-active'
        }
      },
      {
        path: '/generateStatisticalChartRoom',
        component: () => import('@/views/more-data/room-list/charts/index.vue'),
        name: 'GenerateStatisticalChartRoom',
        meta: {
          title: '生成统计图',
          isHidden: true,
          icon: 'data-analysis',
          icon_active: 'data-analysis-active'
        }
      }
    ]
  },
  {
    path: '/configPage',
    name: 'ConfigPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/configPage/index.vue')
  },
  {
    path: '/templateAdd',
    name: 'TemplateAdd',
    component: () => import(/* webpackChunkName: "about" */ '../views/configPage/templateAdd.vue')
  },
  {
    path: '/computeIntro',
    name: 'ComputeIntro',
    component: () => import(/* webpackChunkName: "about" */ '../views/dataPage/compute-intro/index.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由跳转之前
router.beforeEach((to, from, next) => {
  NProgress.start() // 显示进度条
  if (to.path === '/noticeList') {
    next()
  }
  if (!localCache.getCookie('swr_token') && to.path !== '/login') {
    ElMessage({
      type: 'warning',
      message: '请先登录,三秒后跳转登录页'
    })
    setTimeout(() => {
      window.location.href = process.env.VUE_APP_APP_LOGINURL as string
    }, 3000)
  }
  const routesArr: any = routes
  let flag = false
  if (routesArr.length > 8) {
    flag = routesArr.at(-1).children.some((item: any) => {
      item.path === to.path
    })
  }
  if (!store.state.router.hasPermission && localCache.getCookie('swr_token') && to.path !== '/login') {
    return store.dispatch('router/getTemplateList').then(() => {
      if (flag) {
        next({ ...to, replace: true })
      } else {
        next(routesArr.at(-1).children[0].path)
      }
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // 完成进度条
})
export default router
