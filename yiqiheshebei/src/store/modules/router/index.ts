import { Module } from 'vuex'

/*
  后端路由
  permissionList: 模拟，
  getMenu： 后端
*/
// import permissionList from '@/utils/permission'
import { getMenu } from '@/service/login/login'
import { setDefaultRoute } from '@/utils/recursion-router'
//固定路由
import router, { DynamicRoutes } from '@/router'
import view from '@/components/view/view.vue'
import { ElMessage } from 'element-plus'

const routerModule: Module<any, any> = {
  namespaced: true,
  state() {
    return {
      hasPermission: null,
      sidebarMenu: [] /** 导航菜单 */
    }
  },
  mutations: {
    SET_PER(state: any, status: boolean) {
      state.hasPermission = status
    },
    SET_MENU(state: any, menu: Array<any>) {
      state.sidebarMenu = menu
    }
  },
  actions: {
    async FETCH_PERMISSION({ commit }: any) {
      //不需要动态的路由（深拷贝）
      const MainContainer = clone(DynamicRoutes).find((v: any) => v.path === '/index')
      //处理需要动态的路由
      let requestList = []
      const requestObj = await getMenu({ roof: 3 })
      requestList = requestObj.data
      if (requestObj.code === 10 && requestList.length === 0) {
        ElMessage({
          type: 'warning',
          message: '暂无权限查看任何页面,三秒后返回首页'
        })
        setTimeout(() => {
          window.location.href = process.env.VUE_APP_APP_LOGINURL as string
        }, 3000)
      }
      commit('SET_PER', true)

      const routes: Array<any> = filterAsyncRouter(requestList)

      let children: Array<any> = []
      children = MainContainer.children
      //将两种路由结合生成左边的导航栏
      children = children.concat(routes)
      commit('SET_MENU', children)
      MainContainer.children = children
      /*  初始路由 */
      setDefaultRoute([MainContainer])
      router.addRoute(MainContainer)
    }
  }
}

function typeOf(obj: any): any {
  const toString: any = Object.prototype.toString
  const map: any = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
function clone(data: any): any {
  const t = typeOf(data)
  let o: any

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
export const loadView = (view: string) => {
  // 路由懒加载
  return () => import(`@/views/${view}/index.vue`)
}
export const loadIcon = (path: string) => {
  // 图标路径
  if (path) {
    return require(`@images/menu/${path}.png`)
  }
}

//递归处理后端数据
function filterAsyncRouter(asyncRouterMap: Array<any>, base?: string) {
  return asyncRouterMap.filter((route: any) => {
    if (route.children) {
      route.component = view
    } else {
      const pathFormat = route.path.replace(/.+\//, '/')
      route.path = base ? base + pathFormat : pathFormat
      route.component = loadView(route.component)
    }
    if (route.meta && route.meta.icon) {
      const path: string = route.meta.icon + '-active'
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

export default routerModule
