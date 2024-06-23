import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import router, { DynamicRoutes } from '../router/index'
import view from '../components/view/view.vue'
// 后端路由
// import permissionList from '@/utils/permission'
import { getMenu } from '../network/log.js'
import { setDefaultRoute } from '@/utils/recursion-router'
import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { ...state, hasPermission: false, sidebarMenu: [] /** 导航菜单 */ },
  getters: {
    getUserMsg(state) {
      return state.userMsg
    },
    getSchoolDate(state) {
      return state.schoolDate
    },
  },
  mutations: {
    mutLoginMsg(state, data) {
      state.userMsg = data
    },
    mutSchoolDate(state, data) {
      state.schoolDate = data
    },
    mutSetLab(state, data) {
      state.labList = data
    },
    mutSetClass(state, data) {
      state.classList = data
    },
    mutSetmanage(state, data) {
      state.manage = data
    },
    mutSetteacher(state, data) {
      state.teacher = data
    },
    mutSetSubject(state, data) {
      state.subjectArr = data
    },
    mutSetTeacherArr(state, data) {
      state.teacherArr = data
    },
    SET_PER(state, status) {
      state.hasPermission = status
    },
    SET_MENU(state, menu) {
      state.sidebarMenu = menu
    },
  },
  actions: {
    async FETCH_PERMISSION({ commit }) {
      // 不需要动态的路由（深拷贝）
      const MainContainer = clone(DynamicRoutes).find((v) => v.path === '/labhome')
      // 处理需要动态的路由
      const requestObj = await getMenu({ roof: 2 })
      const requestList = requestObj.data
      if (requestObj.code === 10 && requestList.length === 0) {
        Message({
          type: 'warning',
          message: '暂无权限查看任何页面,三秒后返回首页',
        })
        setTimeout(() => {
          window.location.href = process.env.VUE_APP_APP_LOGINURL
        }, 3000)
      }
      commit('SET_PER', true)
      const routes = filterAsyncRouter(requestList)

      let children = []
      children = MainContainer.children
      // 将两种路由结合生成左边的导航栏
      children = children.concat(routes)
      commit('SET_MENU', children)
      MainContainer.children = children
      /*  初始路由 */
      setDefaultRoute([MainContainer])
      router.addRoute(MainContainer)
    },
  },
  modules: {},
})
function typeOf(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  }
  return map[toString.call(obj)]
}
function clone(data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(clone(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = clone(data[i])
    }
  }
  return o
}
export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@views/${view}.vue`], resolve)
}
export const loadIcon = (path) => {
  // console.log(require(`@images/menu/${path}.png`))
  // 图标路径
  if (path) {
    return require(`@images/menu/${path}.png`)
  }
}
// 递归处理后端数据
function filterAsyncRouter(asyncRouterMap, base) {
  return asyncRouterMap.filter((route) => {
    if (route.children) {
      route.component = view
    } else {
      let pathFormat = route.path.replace(/.+\//, '/')
      route.path = base ? base + pathFormat : pathFormat
      route.component = loadView(route.component)
    }
    if (route.meta && route.meta.icon) {
      const path = route.meta.icon + '-active'
      route.meta.icon = loadIcon(route.meta.icon)
      route.meta.icon_active = loadIcon(path)
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route.path)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}
