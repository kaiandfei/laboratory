import Vue from 'vue'
import VueRouter from 'vue-router'
// import AppMain from '../views/AppMain.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/electronicDoorplate',
  },
  {
    path: '/electronicDoorplate',
    name: 'ElectronicDoorplate',
    component: () => import('../views/electronic-doorplate'),
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
// router.beforeEach((to, from, next) => {
//   if (!localCache.getCookie('swr_smart_token') && to.name !== 'Login') {
//     next({
//       name: 'Login',
//       replace: true,
//     })
//   }

//   if (!store.state.hasPermission && localCache.getCookie('swr_smart_token')) {
//     return store.dispatch('FETCH_PERMISSION').then(() => {
//       next({
//         ...to,
//         replace: true,
//       })
//     })
//   } else {
//     next()
//   }
// })

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

// export const DynamicRoutes = [
//   {
//     path: '/AppMain',
//     name: 'AppMain',
//     component: AppMain,
//     // redirect: 'experimentPlan',
//     children: [],
//   },
// ]

export default router
