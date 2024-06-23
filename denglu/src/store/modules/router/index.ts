import { Module } from 'vuex'
import router, { routes } from '@/router'
import { diagramTemplateList } from '@/service/dataPage/index'
import LocalCache from '@/utils/localCache'
import { store } from '@/store/index'
const routerModule: Module<any, any> = {
  namespaced: true,
  state() {
    return {
      hasPermission: false,
      allRoutes: []
    }
  },
  mutations: {
    setHasPermission(state: any, status: boolean) {
      // console.log('333333', status)
      state.hasPermission = status
    },
    getDynamicRoutes(state, data) {
      state.allRoutes = data
    }
  },
  actions: {
    async getTemplateList({ commit }) {
      const params = {
        is_active: 1,
        user_id: store.state.login?.userInfo.id,
      }
      let dynamicRoutes: any = []
      const { data, code } = await diagramTemplateList(params)
      if (code === 10) {
        if (data[0].extra_data) {
          LocalCache.setCache('extra_data', data[0].extra_data)
        }
        dynamicRoutes = setMenuRoutes(data)
        LocalCache.setCache('menuItemI', 0)
        LocalCache.setCache('menuItemTitle', dynamicRoutes.at(-1)?.children[0].meta.title)
        commit('getDynamicRoutes', dynamicRoutes)
        commit('setHasPermission', true)
        dynamicRoutes.forEach((item: any) => {
          router.addRoute(item)
        });
        console.log('1231', dynamicRoutes)
      }
    }
  }
}
function randomStr(len: number, arr: any) {
  let ans = '';
  for (let i = len; i > 0; i--) {
    ans +=
      arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}
function setMenuRoutes(val: any) {
  const staticRoutes: any = routes
  const routesArr: any = []
  val.forEach((item: any, i: number) => {
    if (item.is_active === 1) {
      let obj = {}
      if (item.type === 2) {
        obj = {
          path: '/' + randomStr(6, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']),
          component: () => import(`@/views/dataPage/components/${item.menu_url}/index.vue`),
          name: randomStr(3, ['a', 'b', 'c', 'd', 'e', 'f', 'g']),
          meta: {
            title: item.name,
            isHidden: item.is_active === 1 ? false : true,
            icon: 'function-room',
            icon_active: 'function-room-active',
            extra_data: item.extra_data,
            type: item.type
          }
        }
      } else {
        obj = {
          path: '/' + item.menu_url,
          component: () => import(`@/views/dataPage/components/${item.menu_url}/index.vue`),
          name: item.menu_url.charAt(0).toUpperCase() + item.menu_url.slice(1),
          meta: {
            title: item.name,
            isHidden: item.is_active === 1 ? false : true,
            icon: item.name === '数据中心' ? 'data-analysis' : item.name === '开课数据中心' ? 'school-begins' : item.name === '装备数据中心' ? 'equipment-data' : 'function-room',
            icon_active: item.name === '数据中心' ? 'data-analysis-active' : item.name === '开课数据中心' ? 'school-begins-active' : item.name === '装备数据中心' ? 'equipment-data-active' : 'function-room-active',
            type: item.type
          }
        }
      }
      routesArr.push(obj)
    }
  })
  staticRoutes.forEach((item: any) => {
    if (item.name === 'DataPage') {
      item.children = routesArr
    }
  })
  const flag = staticRoutes.some((item: any) => item.name === 'DataPage')
  if (!flag) {
    staticRoutes.push({
      path: '/dataPage',
      name: 'DataPage',
      component: () => import(/* webpackChunkName: "about" */ '@/views/dataPage/index.vue'),
      meta: {
        title: '',
        isHidden: false
      },
      redirect: routesArr[0].path,
      children: routesArr
    })
  }
  return staticRoutes
  // localCache.setCache('dynamicRoutes', dynamicRoutes)
}

export default routerModule
